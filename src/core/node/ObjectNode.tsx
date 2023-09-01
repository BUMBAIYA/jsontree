import { FC, memo } from "react";
import { CustomNodeProps } from "@/core/node";
import { ForeignNodeWrapper } from "@/core/node/NodeComponents/ForeignNodeWrapper";
import { TextRenderer } from "@/core/node/TextRenderer";
import {
  getKeyColor,
  getValueColor,
} from "@/core/node/NodeComponents/getColors";
import { classNames } from "@/utility/classNames";

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
                key={idx}
                data-key={JSON.stringify(val)}
                data-type={JSON.stringify(val[1])}
                data-x={x}
                data-y={y + idx * 17.8}
                className="block overflow-hidden text-ellipsis whitespace-nowrap px-3 text-xs"
              >
                <span className="inline overflow-hidden text-ellipsis whitespace-nowrap text-[crimson] dark:text-[#5eb9eb]">
                  {JSON.stringify(val[0]).replaceAll('"', "")}:{" "}
                </span>
                <TextRenderer
                  classNames={classNames(getValueColor(JSON.stringify(val[1])))}
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
