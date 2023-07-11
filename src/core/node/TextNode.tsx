import { FC, memo } from "react";
import { CustomNodeProps } from "@/core/node";
import { useTree } from "@/store/useTree";
import { useStored } from "@/store/useStored";
import { ForeignNodeWrapper } from "@/core/node/NodeComponents/ForeignNodeWrapper";
import { TextRenderer } from "@/core/node/TextRenderer";
import { getKeyColor } from "@/core/node//NodeComponents/getColors";
import { classNames } from "@/utility/classNames";

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
      <span
        className={classNames("flex h-full w-full items-center justify-center")}
        style={{
          color: getKeyColor({ parent: isParent, type: type }),
        }}
      >
        <TextRenderer
          style={{ fontSize: isParent ? "12px" : "10px" }}
          innerText={JSON.stringify(text).replaceAll('"', "")}
        />
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
