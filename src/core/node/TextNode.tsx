import { FC, memo } from "react";
import { CustomNodeProps } from "@/core/node";
import { useTree } from "@/store/useTree";
import { useStored } from "@/store/useStored";
import { ForeignNodeWrapper } from "@/core/node/NodeComponents/ForeignNodeWrapper";
import { TextRenderer } from "@/core/node/TextRenderer";
import { getKeyColor } from "@/core/node//NodeComponents/getColors";
import { classNames } from "@/utility/classNames";
import { LinkBreakIcon, LinkIcon } from "@/components/Icons";

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

  const handleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isExpanded) collapseNodes(id);
    else expandNodes(id);
  };

  return (
    <ForeignNodeWrapper width={width} height={height} isObject={false}>
      <span className="flex h-full items-center justify-between px-1">
        <span
          className={classNames(
            "flex h-full w-full items-center justify-center",
          )}
          style={{
            color: getKeyColor({ parent: isParent, type: type }),
          }}
        >
          <TextRenderer
            style={{ fontSize: isParent ? "12px" : "10px" }}
            innerText={JSON.stringify(text).replaceAll('"', "")}
          />
        </span>
        <span className="flex h-full items-center">
          {isParent && childrenCount > 0 && showChildrenCount && (
            <span style={{ fontSize: "12px", paddingInline: "4px" }}>
              {type === "array" ? `[${childrenCount}]` : `{${childrenCount}}`}
            </span>
          )}
          {isParent && hasCollapse && hideCollapse && (
            <button
              style={{ marginInline: "4px", pointerEvents: "all" }}
              className="group h-7 w-7"
              onClick={handleExpand}
            >
              <span
                style={{
                  padding: "4px",
                  backgroundColor: "rgb(229 231 235)",
                  borderRadius: "0.25rem",
                }}
                className="flex h-full w-full items-center justify-center rounded-lg p-2 group-hover:!bg-gray-400"
              >
                {isExpanded ? <LinkBreakIcon /> : <LinkIcon />}
              </span>
            </button>
          )}
        </span>
      </span>
    </ForeignNodeWrapper>
  );
};

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return (
    prev.node.text === next.node.text && prev.node.width === next.node.width
  );
}

export const TextNode = memo(Node, propsAreEqual);
