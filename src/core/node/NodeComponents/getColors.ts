type getKeyColor = {
  parent?: boolean;
  type?: string;
  objectKey?: boolean;
};

export function getKeyColor({ parent, type, objectKey }: getKeyColor) {
  if (parent) {
    if (type === "array") return "orangered";
    return "blue";
  }
  if (objectKey) {
    return "crimson";
  }
}

export function getValueColor(value: string) {
  if (!Number.isNaN(+value)) return "green";
  if (value === "true") return "blue";
  if (value === "false") return "red";
  if (value === "null") return "black";
  return "darkblue";
}
