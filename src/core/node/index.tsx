import React from "react";
import { Node, NodeProps } from "reaflow";
import { TextNode } from "@/core/node/TextNode";
import { ObjectNode } from "@/core/node/ObjectNode";

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

export const CustomNode = (nodeProps: NodeProps) => {
  const { text, data } = nodeProps.properties;

  return (
    <Node
      {...nodeProps}
      rx={5}
      ry={5}
      {...(data.isEmpty && rootProps)}
      label={<React.Fragment />}
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
