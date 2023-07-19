import { FC, memo } from "react";
import { CustomNodeProps } from "@/core/node";
import { useTree } from "@/store/useTree";
import { useStored } from "@/store/useStored";
import { ForeignNodeWrapper } from "@/core/node/NodeComponents/ForeignNodeWrapper";
import { TextRenderer } from "@/core/node/TextRenderer";
import { getKeyColor } from "@/core/node//NodeComponents/getColors";
import { classNames } from "@/utility/classNames";
import { LinkBreakIcon, LinkIcon } from "@/components/Icons";
import { isContentImage } from "@/core/calculateNodeSize";

const Node: FC<CustomNodeProps> = ({ node, x, y, hasCollapse = false }) => {
  const {
    id,
    text,
    width,
    height,
    data: { isParent, childrenCount, type },
  } = node;
  const hideCollapse = useStored((state) => state.hideCollapse);
  const showChildrenCount = useStored((state) => state.childrenCount);
  const expandNodes = useTree((state) => state.expandNodes);
  const collapseNodes = useTree((state) => state.collapseNodes);
  const isExpanded = useTree((state) => state.collapsedParents.includes(id));
  const imagePreview = useStored((state) => state.imagePreview);
  const isImage = imagePreview && isContentImage(text);

  const handleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isExpanded) collapseNodes(id);
    else expandNodes(id);
  };

  return (
    <ForeignNodeWrapper width={width} height={height} isObject={false}>
      {isImage ? (
        <div className="p-[5px]">
          <picture>
            <img
              height={70}
              width={70}
              src={text}
              alt="node img"
              className="object-contain"
            />
          </picture>
        </div>
      ) : (
        <span className="flex h-full items-center justify-between px-1">
          <span
            className={classNames(
              "flex h-full w-full items-center justify-center",
              getKeyColor({ parent: isParent, type: type }),
            )}
          >
            <TextRenderer
              classNames={classNames(isParent ? "text-xs" : "text-[10px]")}
              innerText={JSON.stringify(text).replaceAll('"', "")}
            />
          </span>
          <span className="flex h-full items-center gap-1 dark:text-gray-300">
            {isParent && childrenCount > 0 && showChildrenCount && (
              <span className="px-1 text-xs">
                {type === "array" ? `[${childrenCount}]` : `{${childrenCount}}`}
              </span>
            )}
            {isParent && hasCollapse && hideCollapse && (
              <button
                className="group pointer-events-auto h-7 w-7 rounded-md bg-gray-200 p-1 hover:bg-gray-300 dark:bg-vsdark-500 dark:ring-1 dark:ring-gray-200/10"
                onClick={handleExpand}
              >
                {isExpanded ? <LinkBreakIcon /> : <LinkIcon />}
              </button>
            )}
          </span>
        </span>
      )}
    </ForeignNodeWrapper>
  );
};

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return (
    prev.node.text === next.node.text && prev.node.width === next.node.width
  );
}

export const TextNode = memo(Node, propsAreEqual);
