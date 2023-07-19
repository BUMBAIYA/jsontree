type getKeyColor = {
  parent?: boolean;
  type?: string;
  objectKey?: boolean;
};

export function getKeyColor({ parent, type, objectKey }: getKeyColor) {
  if (parent) {
    if (type === "array") return "text-[orangered] dark:text-[orange]";
    return "text-[blue] dark:text-[deepskyblue]";
  }
  if (objectKey) {
    return "text-[crimson]";
  }
  return "text-black dark:text-gray-300";
}

export function getValueColor(value: string) {
  if (!Number.isNaN(+value)) return "text-[green] dark:text-[limegreen]";
  if (value === "true") return "text-[blue] dark:text-[lightgreen]";
  if (value === "false") return "text-[red]";
  if (value === "null") return "text-black dark:text-gray-400";
  return "text-[darkblue] dark:text-[darksalmon]";
}
