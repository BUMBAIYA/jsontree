type GithubSource = {
  type: "github";
  owner: string;
  repo: string;
  ref?: string;
  jsonPath: string;
  identifier: string;
};

type NpmSource = {
  type: "npm";
  packageName: string;
  identifier: string;
};

type DirectUrlSource = {
  type: "direct";
  url: string;
  identifier: string;
};

type Source = GithubSource | NpmSource | DirectUrlSource;

export type RemoteJsonImportResult = {
  source: "github" | "npm" | "direct";
  identifier: string;
  pretty: string;
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

/** Resolves a GitHub repo/tree/blob path to a JSON file path (defaults to package.json for folders). */
function buildJsonPath(basePath: string[]) {
  if (basePath.length === 0) return "package.json";
  const last = basePath[basePath.length - 1];
  if (last.endsWith(".json")) {
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
    jsonPath: buildJsonPath(basePath),
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
    jsonPath: "package.json",
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
    return {
      type: "direct",
      url: value,
      identifier: value,
    };
  }

  const githubSource = parseGithubShorthand(value);
  if (githubSource) return githubSource;

  return {
    type: "npm",
    packageName: value,
    identifier: value,
  };
}

function githubRawContentUrl(source: GithubSource): string {
  const ref = source.ref || "HEAD";
  const pathSegments = source.jsonPath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `https://raw.githubusercontent.com/${encodeURIComponent(
    source.owner,
  )}/${encodeURIComponent(source.repo)}/${encodeURIComponent(
    ref,
  )}/${pathSegments}`;
}

async function fetchText(url: string, init?: RequestInit): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url, {
      mode: "cors",
      ...init,
    });
  } catch (e: unknown) {
    const message =
      e instanceof TypeError
        ? "Network error or blocked by CORS. Try a URL that allows browser access (for example raw.githubusercontent.com or a public API with CORS)."
        : "Request failed.";
    throw new Error(message);
  }

  if (!response.ok) {
    throw new Error(
      `Request failed (${String(response.status)} ${response.statusText}).`,
    );
  }

  return response.text();
}

function parseJsonPretty(text: string, context: string): object {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error(`${context}: empty response`);
  }
  try {
    return JSON.parse(trimmed) as object;
  } catch {
    throw new Error(`${context}: response is not valid JSON`);
  }
}

async function fetchGithubJson(source: GithubSource): Promise<object> {
  const url = githubRawContentUrl(source);
  const text = await fetchText(url, {
    headers: { Accept: "application/json, text/plain, */*" },
  });
  return parseJsonPretty(text, "GitHub");
}

async function fetchNpmJson(source: NpmSource): Promise<object> {
  const endpoint = `https://registry.npmjs.org/${encodeURIComponent(
    source.packageName,
  )}/latest`;
  const text = await fetchText(endpoint, {
    headers: {
      Accept: "application/json",
    },
  });
  return parseJsonPretty(text, "npm");
}

async function fetchDirectJson(source: DirectUrlSource): Promise<object> {
  const text = await fetchText(source.url, {
    headers: { Accept: "application/json, text/plain, */*" },
  });
  return parseJsonPretty(text, "URL");
}

export async function importRemoteJson(
  rawInput: string,
): Promise<RemoteJsonImportResult> {
  const source = resolveSource(rawInput);
  const data =
    source.type === "github"
      ? await fetchGithubJson(source)
      : source.type === "npm"
      ? await fetchNpmJson(source)
      : await fetchDirectJson(source);

  return {
    source: source.type,
    identifier: source.identifier,
    pretty: JSON.stringify(data, null, 2),
  };
}
