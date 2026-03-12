type JsonSchema = {
  $schema?: string;
  title?: string;
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  anyOf?: JsonSchema[];
  additionalProperties?: boolean;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (isPlainObject(value)) {
    const keys = Object.keys(value).sort();
    return `{${keys
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function dedupeSchemas(schemas: JsonSchema[]): JsonSchema[] {
  const seen = new Set<string>();
  const deduped: JsonSchema[] = [];

  schemas.forEach((schema) => {
    const key = stableStringify(schema);
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(schema);
    }
  });

  return deduped;
}

function mergeSchemas(schemas: JsonSchema[]): JsonSchema {
  const flatSchemas = schemas.flatMap((schema) =>
    schema.anyOf ? schema.anyOf : [schema],
  );
  const unique = dedupeSchemas(flatSchemas);

  if (unique.length === 1) {
    return unique[0];
  }

  const objectSchemas = unique.filter(
    (schema) => schema.type === "object" && schema.properties,
  );
  if (objectSchemas.length === unique.length) {
    const allKeys = new Set<string>();
    objectSchemas.forEach((schema) => {
      Object.keys(schema.properties || {}).forEach((key) => allKeys.add(key));
    });

    const properties: Record<string, JsonSchema> = {};
    const required: string[] = [];
    const schemaCount = objectSchemas.length;

    Array.from(allKeys).forEach((key) => {
      const keySchemas = objectSchemas
        .map((schema) => schema.properties?.[key])
        .filter((schema): schema is JsonSchema => Boolean(schema));
      properties[key] = mergeSchemas(keySchemas);

      const presentCount = objectSchemas.filter(
        (schema) => schema.properties?.[key],
      ).length;
      if (presentCount === schemaCount) {
        required.push(key);
      }
    });

    return {
      type: "object",
      properties,
      ...(required.length > 0 ? { required } : {}),
      additionalProperties: false,
    };
  }

  return { anyOf: unique };
}

function inferNode(value: unknown): JsonSchema {
  if (value === null) {
    return { type: "null" };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { type: "array", items: {} };
    }

    const itemSchemas = value.map((item) => inferNode(item));
    return {
      type: "array",
      items: mergeSchemas(itemSchemas),
    };
  }

  if (isPlainObject(value)) {
    const properties: Record<string, JsonSchema> = {};
    const required: string[] = [];

    Object.entries(value).forEach(([key, val]) => {
      properties[key] = inferNode(val);
      required.push(key);
    });

    return {
      type: "object",
      properties,
      ...(required.length > 0 ? { required } : {}),
      additionalProperties: false,
    };
  }

  if (typeof value === "string") return { type: "string" };
  if (typeof value === "boolean") return { type: "boolean" };
  if (typeof value === "number") {
    return { type: Number.isInteger(value) ? "integer" : "number" };
  }

  return {};
}

export function inferJsonSchema(value: unknown): JsonSchema {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "InferredSchema",
    ...inferNode(value),
  };
}
