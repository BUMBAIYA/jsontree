import { FC, memo } from "react";
import { CustomNodeProps } from "@/core/node";
import { ForeignNodeWrapper } from "@/core/node/NodeComponents/ForeignNodeWrapper";
import { TextRenderer } from "@/core/node/TextRenderer";

const Node: FC<CustomNodeProps> = ({ node, x, y }) => {
  const { text, width, height, data } = node;
  if (data.isEmpty) return null;

  return (
    <ForeignNodeWrapper isObject width={width} height={height}>
      <span className="flex h-full items-center font-mono">
        <span className="flex flex-col">
          {text.map((val: any, idx: any) => {
            return (
              <span
                style={{ fontSize: "12px", display: "block" }}
                className="overflow-hidden text-ellipsis whitespace-nowrap px-2"
                key={idx}
              >
                <span className="inline overflow-hidden text-ellipsis whitespace-nowrap p-2">
                  {JSON.stringify(val[0]).replaceAll('"', "")}:{" "}
                </span>
                <TextRenderer innerText={JSON.stringify(val[1])} />
              </span>
            );
          })}
        </span>
      </span>
    </ForeignNodeWrapper>
  );
};

function propsAreEqual(prev: CustomNodeProps, next: CustomNodeProps) {
  return (
    String(prev.node.text) === String(next.node.text) &&
    prev.node.width === next.node.width
  );
}

export const ObjectNode = memo(Node, propsAreEqual);
