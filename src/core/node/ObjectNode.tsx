import { FC, memo } from "react";
import { CustomNodeProps } from "@/core/node";
import { ForeignNodeWrapper } from "@/core/node/NodeComponents/ForeignNodeWrapper";
import { TextRenderer } from "@/core/node/TextRenderer";
import {
  getKeyColor,
  getValueColor,
} from "@/core/node/NodeComponents/getColors";

const Node: FC<CustomNodeProps> = ({ node, x, y }) => {
  const { text, width, height, data } = node;
  if (data.isEmpty) return null;

  return (
    <ForeignNodeWrapper isObject width={width} height={height}>
      <span className="flex h-full items-center">
        <span className="flex flex-col" style={{ fontSize: "12px" }}>
          {text.map((val: any, idx: any) => {
            return (
              <span
                className="block overflow-hidden text-ellipsis whitespace-nowrap px-2 text-xs"
                key={idx}
              >
                <span
                  style={{ color: getKeyColor({ objectKey: true }) }}
                  className="inline overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {JSON.stringify(val[0]).replaceAll('"', "")}:{" "}
                </span>
                <TextRenderer
                  style={{ color: getValueColor(JSON.stringify(val[1])) }}
                  innerText={JSON.stringify(val[1])}
                />
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
