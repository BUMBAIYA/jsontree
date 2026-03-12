import type { NextApiRequest, NextApiResponse } from "next";

type GithubSource = {
  type: "github";
  owner: string;
  repo: string;
  ref?: string;
  packagePath: string;
  identifier: string;
};

type NpmSource = {
  type: "npm";
  packageName: string;
  identifier: string;
};

type Source = GithubSource | NpmSource;

type SuccessResponse = {
  source: "github" | "npm";
  identifier: string;
  pretty: string;
};

const DEFAULT_GITHUB_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "jsontree-importer",
};

const BLOCKED_GITHUB_SEGMENTS = new Set([
  "issues",
  "pull",
  "pulls",
  "actions",
  "releases",
  "tags",
  "commits",
  "compare",
  "security",
  "wiki",
  "projects",
  "discussions",
  "settings",
]);

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function normalizeGithubRepo(value: string) {
  return value.replace(/\.git$/i, "");
}

function buildPackagePath(basePath: string[]) {
  if (basePath.length === 0) return "package.json";
  if (basePath[basePath.length - 1] === "package.json") {
    return basePath.join("/");
  }
  return `${basePath.join("/")}/package.json`;
}

function parseGithubFromUrl(url: URL): GithubSource {
  const pathParts = url.pathname.split("/").filter(Boolean);
  if (pathParts.length < 2) {
    throw new Error("Invalid GitHub repository URL");
  }

  const owner = decodeURIComponent(pathParts[0]);
  const repo = normalizeGithubRepo(decodeURIComponent(pathParts[1]));
  if (!owner || !repo) {
    throw new Error("Invalid GitHub repository URL");
  }

  let ref: string | undefined;
  let basePath: string[] = [];

  if (pathParts[2] === "tree" || pathParts[2] === "blob") {
    if (!pathParts[3]) {
      throw new Error("GitHub branch is missing in the URL");
    }
    ref = decodeURIComponent(pathParts[3]);
    basePath = pathParts.slice(4).map((segment) => decodeURIComponent(segment));
  } else if (pathParts.length > 2) {
    const route = pathParts[2];
    if (BLOCKED_GITHUB_SEGMENTS.has(route)) {
      throw new Error(
        "Unsupported GitHub page. Use repository root or tree/blob URL.",
      );
    }
    basePath = pathParts.slice(2).map((segment) => decodeURIComponent(segment));
  }

  return {
    type: "github",
    owner,
    repo,
    ref,
    packagePath: buildPackagePath(basePath),
    identifier: `${owner}/${repo}`,
  };
}

function parseNpmFromUrl(url: URL): NpmSource {
  const pathParts = url.pathname.split("/").filter(Boolean);
  if (pathParts[0] !== "package") {
    throw new Error("Unsupported npm URL. Use npm package page URL.");
  }

  const first = pathParts[1];
  if (!first) {
    throw new Error("npm package is missing in URL");
  }

  let packageName = decodeURIComponent(first);
  if (packageName.startsWith("@")) {
    const second = pathParts[2];
    if (!second) {
      throw new Error("Scoped npm package is incomplete");
    }
    packageName = `${packageName}/${decodeURIComponent(second)}`;
  }

  return {
    type: "npm",
    packageName,
    identifier: packageName,
  };
}

function parseGithubShorthand(value: string): GithubSource | null {
  const match = value.match(/^([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)(?:\.git)?$/);
  if (!match) return null;

  return {
    type: "github",
    owner: match[1],
    repo: normalizeGithubRepo(match[2]),
    packagePath: "package.json",
    identifier: `${match[1]}/${normalizeGithubRepo(match[2])}`,
  };
}

function resolveSource(rawValue: string): Source {
  const value = rawValue.trim();
  if (!value) {
    throw new Error("Source is required");
  }

  if (isHttpUrl(value)) {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new Error("Invalid URL");
    }

    const host = url.hostname.toLowerCase();
    if (host === "github.com" || host === "www.github.com") {
      return parseGithubFromUrl(url);
    }
    if (host === "npmjs.com" || host === "www.npmjs.com") {
      return parseNpmFromUrl(url);
    }
    throw new Error("Unsupported domain. Use github.com or npmjs.com.");
  }

  const githubSource = parseGithubShorthand(value);
  if (githubSource) return githubSource;

  return {
    type: "npm",
    packageName: value,
    identifier: value,
  };
}

async function fetchGithubPackageJson(source: GithubSource): Promise<object> {
  const encodedPath = source.packagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const endpoint = new URL(
    `https://api.github.com/repos/${encodeURIComponent(
      source.owner,
    )}/${encodeURIComponent(source.repo)}/contents/${encodedPath}`,
  );
  if (source.ref) {
    endpoint.searchParams.set("ref", source.ref);
  }

  const headers: Record<string, string> = { ...DEFAULT_GITHUB_HEADERS };
  const token =
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN ||
    process.env.GITHUB_PAT ||
    "";
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(endpoint.toString(), {
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      payload?.message ||
      `GitHub request failed with status ${String(response.status)}`;
    throw new Error(message);
  }

  const payload = await response.json();
  const encodedContent = payload?.content;
  if (!encodedContent || payload?.encoding !== "base64") {
    throw new Error("package.json not found in the provided GitHub source");
  }

  const rawContent = Buffer.from(encodedContent, "base64").toString("utf8");
  return JSON.parse(rawContent);
}

async function fetchNpmPackageJson(source: NpmSource): Promise<object> {
  const endpoint = `https://registry.npmjs.org/${encodeURIComponent(
    source.packageName,
  )}/latest`;
  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
      "User-Agent": "jsontree-importer",
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      payload?.error ||
      `npm request failed with status ${String(response.status)}`;
    throw new Error(message);
  }

  return response.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | { error: string }>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sourceInput =
      typeof req.body?.source === "string" ? req.body.source : "";
    const source = resolveSource(sourceInput);

    const packageJson =
      source.type === "github"
        ? await fetchGithubPackageJson(source)
        : await fetchNpmPackageJson(source);

    return res.status(200).json({
      source: source.type,
      identifier: source.identifier,
      pretty: JSON.stringify(packageJson, null, 2),
    });
  } catch (error: any) {
    const message = error?.message || "Failed to import package.json";
    return res.status(400).json({ error: message });
  }
}
