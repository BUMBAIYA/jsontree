import { EdgeData, NodeData } from "@/core/type";

const IDENTIFIER_REGEX = /^[A-Za-z_$][\w$]*$/;

const normalizeKey = (value: unknown) => {
  if (typeof value !== "string") return null;
  const key = value.trim();
  if (!key || key === "{}" || key === "[]") return null;
  return key;
};

const appendObjectKey = (path: string, key: string) => {
  if (IDENTIFIER_REGEX.test(key)) {
    return `${path}.${key}`;
  }

  const escapedKey = key.replaceAll("\\", "\\\\").replaceAll("'", "\\'");
  return `${path}['${escapedKey}']`;
};

export function getNodePath(
  nodes: NodeData[],
  edges: EdgeData[],
  nodeId: string,
) {
  if (!nodeId || nodes.length === 0) return "$";

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const parentByChild = new Map<string, string>();
  const childrenByParent = new Map<string, string[]>();

  for (const edge of edges) {
    if (!edge.from || !edge.to) continue;
    if (!parentByChild.has(edge.to)) {
      parentByChild.set(edge.to, edge.from);
    }
    const children = childrenByParent.get(edge.from) ?? [];
    children.push(edge.to);
    childrenByParent.set(edge.from, children);
  }

  const chain: string[] = [];
  const seen = new Set<string>();
  let currentId: string | undefined = nodeId;

  while (currentId && !seen.has(currentId)) {
    chain.push(currentId);
    seen.add(currentId);
    currentId = parentByChild.get(currentId);
  }

  if (chain.length === 0) return "$";
  chain.reverse();

  let resolvedPath = "$";
  const rootNode = nodeMap.get(chain[0]);

  if (rootNode && !rootNode.data?.isEmpty) {
    const rootKey = normalizeKey(rootNode.text);
    if (
      (rootNode.data?.type === "object" || rootNode.data?.type === "array") &&
      rootKey
    ) {
      resolvedPath = appendObjectKey(resolvedPath, rootKey);
    }
  }

  for (let i = 1; i < chain.length; i++) {
    const parentNode = nodeMap.get(chain[i - 1]);
    const currentNode = nodeMap.get(chain[i]);
    if (!parentNode || !currentNode) continue;

    if (parentNode.data?.type === "array") {
      const children = childrenByParent.get(parentNode.id) ?? [];
      const childIndex = children.indexOf(currentNode.id);
      resolvedPath += `[${childIndex >= 0 ? childIndex : 0}]`;

      const arrayChildKey = normalizeKey(currentNode.text);
      if (
        (currentNode.data?.type === "object" ||
          currentNode.data?.type === "array") &&
        arrayChildKey
      ) {
        resolvedPath = appendObjectKey(resolvedPath, arrayChildKey);
      }
      continue;
    }

    const currentKey = normalizeKey(currentNode.text);
    if (
      (currentNode.data?.type === "object" ||
        currentNode.data?.type === "array") &&
      currentKey
    ) {
      resolvedPath = appendObjectKey(resolvedPath, currentKey);
    }
  }

  return resolvedPath;
}
