export type JsonNodeType =
  | "object"
  | "array"
  | "string"
  | "number"
  | "boolean"
  | "null";

export type JsonStats = {
  totalNodes: number;
  maxDepth: number;
  typeCounts: Record<JsonNodeType, number>;
  topKeys: Array<{ key: string; count: number }>;
};

type StackItem = {
  value: unknown;
  depth: number;
};

const EMPTY_STATS: JsonStats = {
  totalNodes: 0,
  maxDepth: 0,
  typeCounts: {
    object: 0,
    array: 0,
    string: 0,
    number: 0,
    boolean: 0,
    null: 0,
  },
  topKeys: [],
};

function sortTopKeys(keyMap: Map<string, number>) {
  return Array.from(keyMap.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    })
    .slice(0, 8)
    .map(([key, count]) => ({ key, count }));
}

export function getJsonStats(json: unknown): JsonStats {
  if (json === undefined) return EMPTY_STATS;

  const typeCounts: Record<JsonNodeType, number> = {
    object: 0,
    array: 0,
    string: 0,
    number: 0,
    boolean: 0,
    null: 0,
  };
  const keyCountMap = new Map<string, number>();

  let totalNodes = 0;
  let maxDepth = 0;

  const stack: StackItem[] = [{ value: json, depth: 1 }];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;

    const { value, depth } = current;
    totalNodes += 1;
    if (depth > maxDepth) maxDepth = depth;

    if (value === null) {
      typeCounts.null += 1;
      continue;
    }

    if (Array.isArray(value)) {
      typeCounts.array += 1;
      for (let i = value.length - 1; i >= 0; i -= 1) {
        stack.push({ value: value[i], depth: depth + 1 });
      }
      continue;
    }

    if (typeof value === "object") {
      typeCounts.object += 1;
      const entries = Object.entries(value as Record<string, unknown>);
      for (let i = entries.length - 1; i >= 0; i -= 1) {
        const [key, childValue] = entries[i];
        keyCountMap.set(key, (keyCountMap.get(key) || 0) + 1);
        stack.push({ value: childValue, depth: depth + 1 });
      }
      continue;
    }

    if (typeof value === "string") {
      typeCounts.string += 1;
      continue;
    }

    if (typeof value === "number") {
      typeCounts.number += 1;
      continue;
    }

    if (typeof value === "boolean") {
      typeCounts.boolean += 1;
    }
  }

  return {
    totalNodes,
    maxDepth,
    typeCounts,
    topKeys: sortTopKeys(keyCountMap),
  };
}
