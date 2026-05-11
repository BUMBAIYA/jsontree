import React from "react";
import { Node, NodeProps } from "reaflow";
import { TextNode } from "@/core/node/TextNode";
import { ObjectNode } from "@/core/node/ObjectNode";
import { NodeData } from "@/core/type";
import { useTree } from "@/store/useTree";

export interface CustomNodeProps {
  node: NodeData;
  x: number;
  y: number;
  hasCollapse?: boolean;
}

const rootProps = {
  rx: 50,
  ry: 50,
};

interface CustomNode extends NodeProps {
  isLightMode: boolean;
}

export const CustomNode = (nodeProps: CustomNode) => {
  const { text, data } = nodeProps.properties;
  const setSelectedNode = useTree((state) => state.setSelectedNode);

  return (
    <Node
      {...nodeProps}
      rx={5}
      ry={5}
      {...(data.isEmpty && rootProps)}
      label={<React.Fragment />}
      onClick={(_, selectedNode) => setSelectedNode(selectedNode as NodeData)}
      className={`${
        nodeProps.isLightMode ? "!fill-[#f6f8fa]" : "!fill-[#2B2C3E]"
      }`}
    >
      {({ node, x, y }) => {
        if (Array.isArray(text)) {
          return <ObjectNode node={node as NodeData} x={x} y={y} />;
        }

        return (
          <TextNode
            node={node as NodeData}
            hasCollapse={!!data.childrenCount}
            x={x}
            y={y}
          />
        );
      }}
    </Node>
  );
};
