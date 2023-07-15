import { useTree } from "@/store/useTree";
import { useStored } from "@/store/useStored";
import { isImageUrl } from "@/utility/checkFormat";

const CHAR_WIDTH = 7.2 as const;
const CHAR_HEIGHT = 18 as const;
const NODE_TOTAL_PADDING = 20 as const;
const WIDTH_OFFSET = 4 as const;

export const isContentImage = (value: string | [string, string][]) => {
  if (typeof value !== "string") return false;

  const isImageURL = isImageUrl(value);
  const isBase64 = value.startsWith("data:image/") && value.includes("base64");
  return isImageURL || isBase64;
};

const sizeCache = new Map<
  string | [string, string][],
  { width: number; height: number }
>();

export const calculateNodeSize = (
  text: string | [string, string][],
  isParent = false,
) => {
  let lines: string[] = [];
  const { foldNodes } = useTree.getState();
  const { imagePreview } = useStored.getState();
  const isImage = isContentImage(text) && imagePreview;
  const cacheKey = [text, isParent, foldNodes].toString();

  // check cache
  if (sizeCache.has(cacheKey)) {
    const size = sizeCache.get(cacheKey);
    if (size) return size;
  }

  if (typeof text !== "string") {
    lines = text.map(([k, v]) => `${k}: ${JSON.stringify(v).slice(0, 80)}`);
  } else {
    lines.push(text);
  }

  if (!lines) return { width: 45, height: 45 };
  const calculateWidthAndHeight = () => {
    let maxLen = 0;
    let rowCount = 0;
    for (let x of lines) {
      if (x.length > maxLen) {
        maxLen = x.length;
      }
      rowCount++;
    }

    let width = Math.round(
      CHAR_WIDTH * maxLen + NODE_TOTAL_PADDING + WIDTH_OFFSET,
    );
    let height = CHAR_HEIGHT * rowCount + NODE_TOTAL_PADDING;

    return { width, height };
  };

  let sizes = calculateWidthAndHeight();
  if (isImage) sizes = { width: 80, height: 80 };
  if (foldNodes) sizes.width = 300;
  if (isParent && foldNodes) sizes.width = 170;
  if (isParent) sizes.width += 100;
  if (sizes.width > 700) sizes.width = 700;

  sizeCache.set(cacheKey, sizes);
  return sizes;
};
