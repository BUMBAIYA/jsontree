import { EdgeData, NodeData } from "@/core/type";

type CollapsedGraphState = {
  collapsedParents: string[];
  collapsedNodes: string[];
  collapsedEdges: string[];
  graphCollapsed: boolean;
};

export function getCollapsedGraphState(
  nodes: NodeData[],
  edges: EdgeData[],
): CollapsedGraphState {
  const toIds = new Set(
    edges.map((edge) => edge.to).filter((id): id is string => Boolean(id)),
  );
  const parentNodesIds = Array.from(
    new Set(
      edges
        .map((edge) => edge.from)
        .filter((id): id is string => {
          if (!id) return false;
          return !toIds.has(id);
        }),
    ),
  );

  const parentNodesSet = new Set(parentNodesIds);
  const secondDegreeNodesIds = new Set(
    edges
      .filter((edge) => edge.from && parentNodesSet.has(edge.from))
      .map((edge) => edge.to)
      .filter((id): id is string => Boolean(id)),
  );

  const collapsedParents = nodes
    .filter((node) => !parentNodesSet.has(node.id) && node.data?.isParent)
    .map((node) => node.id);
  const collapsedNodes = nodes
    .filter(
      (node) =>
        !parentNodesSet.has(node.id) && !secondDegreeNodesIds.has(node.id),
    )
    .map((node) => node.id);
  const collapsedEdges = edges
    .filter((edge) => edge.from && !parentNodesSet.has(edge.from))
    .map((edge) => edge.id);

  return {
    collapsedParents,
    collapsedNodes,
    collapsedEdges,
    graphCollapsed: collapsedNodes.length > 0 || collapsedEdges.length > 0,
  };
}
