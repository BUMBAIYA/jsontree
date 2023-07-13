type getKeyColor = {
  parent?: boolean;
  type?: string;
  objectKey?: boolean;
};

export function getKeyColor({ parent, type, objectKey }: getKeyColor) {
  if (parent) {
    if (type === "array") return "text-[orangered]";
    return "text-[blue]";
  }
  if (objectKey) {
    return "text-[crimson]";
  }
  return "text-black";
}

export function getValueColor(value: string) {
  if (!Number.isNaN(+value)) return "text-[green]";
  if (value === "true") return "text-[blue]";
  if (value === "false") return "text-[red]";
  if (value === "null") return "text-black";
  return "text-[darkblue]";
}
