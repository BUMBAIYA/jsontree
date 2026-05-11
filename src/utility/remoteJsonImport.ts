export type RemoteJsonImportResult = {
  source: "direct";
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

/**
 * Turns a github.com blob/tree link into a raw.githubusercontent.com URL.
 * Repo-only or folder-only links are rejected so we never guess a filename (e.g. package.json).
 */
function githubWebUrlToRawFetchUrl(url: URL): string {
  const host = url.hostname.toLowerCase();
  if (host !== "github.com" && host !== "www.github.com") {
    throw new Error("Internal: not a GitHub web URL");
  }

  const pathParts = url.pathname.split("/").filter(Boolean);
  if (pathParts.length < 2) {
    throw new Error("Invalid GitHub URL.");
  }

  const owner = decodeURIComponent(pathParts[0]);
  const repo = normalizeGithubRepo(decodeURIComponent(pathParts[1]));
  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL.");
  }

  if (pathParts[2] === "blob" || pathParts[2] === "tree") {
    if (!pathParts[3]) {
      throw new Error("GitHub URL is missing the branch or tag.");
    }
    const ref = decodeURIComponent(pathParts[3]);
    const filePath = pathParts
      .slice(4)
      .map((segment) => decodeURIComponent(segment))
      .join("/");
    if (!filePath) {
      throw new Error(
        "That GitHub link points at a folder or branch, not a file. Open the JSON file on GitHub, click Raw, and paste that https URL here.",
      );
    }
    const encodedPath = filePath
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    return `https://raw.githubusercontent.com/${encodeURIComponent(
      owner,
    )}/${encodeURIComponent(repo)}/${encodeURIComponent(ref)}/${encodedPath}`;
  }

  if (pathParts.length > 2) {
    const route = pathParts[2];
    if (BLOCKED_GITHUB_SEGMENTS.has(route)) {
      throw new Error(
        "Unsupported GitHub page. Paste a Raw file URL (raw.githubusercontent.com) or a blob/tree link to a specific file.",
      );
    }
  }

  throw new Error(
    "Paste a direct https link to JSON (for example raw.githubusercontent.com/…/file.json), or a GitHub blob/tree URL to a specific file.",
  );
}

/** Returns the URL to fetch (after normalizing github.com → raw when applicable). */
function resolveJsonFetchUrl(rawInput: string): string {
  const value = rawInput.trim();
  if (!value) {
    throw new Error("Enter a URL.");
  }

  if (!isHttpUrl(value)) {
    throw new Error(
      "Enter a full https:// URL that returns JSON (for example a raw file or public API URL).",
    );
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Invalid URL.");
  }

  const host = url.hostname.toLowerCase();
  if (host === "github.com" || host === "www.github.com") {
    return githubWebUrlToRawFetchUrl(url);
  }

  return value;
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
        ? "Network error or blocked by CORS. The server must allow your browser to read the response (try a raw GitHub URL or another host that sends CORS headers)."
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

function parseJsonPretty(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Empty response — the URL did not return any body.");
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    throw new Error("The response is not valid JSON.");
  }
}

export async function importRemoteJson(
  rawInput: string,
): Promise<RemoteJsonImportResult> {
  const fetchUrl = resolveJsonFetchUrl(rawInput);
  const text = await fetchText(fetchUrl, {
    headers: { Accept: "application/json, text/plain, */*" },
  });
  const data = parseJsonPretty(text);

  return {
    source: "direct",
    identifier: fetchUrl,
    pretty: JSON.stringify(data, null, 2),
  };
}
