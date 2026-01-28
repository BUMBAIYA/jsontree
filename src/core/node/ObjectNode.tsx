import { FC, memo } from "react";
import { CustomNodeProps } from "@/core/node";
import { ForeignNodeWrapper } from "@/core/node/NodeComponents/ForeignNodeWrapper";
import { TextRenderer } from "@/core/node/TextRenderer";
import {
  getKeyColor,
  getValueColor,
} from "@/core/node/NodeComponents/getColors";
import { classNames } from "@/utility/classNames";
import { useTree } from "@/store/useTree";

const isObjectOrArrayCount = (v: string) => /^[{\[]\d+[}\]]$/.test(v);

const Node: FC<CustomNodeProps> = ({ node, x, y }) => {
  const { text, width, height, data } = node;
  const centerOnNode = useTree((s) => s.centerOnNode);
  const setHoveredNodeId = useTree((s) => s.setHoveredNodeId);
  const hoveredNodeId = useTree((s) => s.hoveredNodeId);
  if (data.isEmpty) return null;

  return (
    <ForeignNodeWrapper
      isObject
      width={width}
      height={height}
      nodeId={node.id}
      isHighlighted={hoveredNodeId === node.id}
    >
      <span className="flex h-full items-center">
        <span className="flex flex-col" style={{ fontSize: "12px" }}>
          {text.map((val: any, idx: any) => {
            const keyStr = JSON.stringify(val[0]).replaceAll('"', "");
            const valStr = String(val[1]);
            const targetId = data?.objectKeyTargets?.[val[0]];
            const isClickable =
              isObjectOrArrayCount(valStr) && typeof targetId === "string";

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
                  {keyStr}:{" "}
                </span>
                {isClickable ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      centerOnNode(targetId);
                    }}
                    onMouseEnter={() => setHoveredNodeId(targetId)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className={classNames(
                      "pointer-events-auto cursor-pointer rounded px-0.5 outline-none hover:bg-black/10 dark:hover:bg-white/10",
                      getValueColor(valStr),
                    )}
                  >
                    {valStr}
                  </button>
                ) : (
                  <TextRenderer
                    classNames={classNames(getValueColor(valStr))}
                    innerText={valStr}
                  />
                )}
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
