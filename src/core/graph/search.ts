export const searchQuery = (param: string) => {
  return document.querySelectorAll(param);
};

export const cleanupHighlight = () => {
  const nodes = document.querySelectorAll(
    "rect.searched_node, .highlight_node",
  );

  nodes.forEach((node) => {
    node.classList.remove("highlight_node", "searched_node");
  });
};

export const highlightMatchedNodes = (
  nodes: NodeListOf<Element>,
  selectedNode: number,
) => {
  nodes.forEach((node) => {
    const foreignObject = node.parentElement?.closest("foreignObject");
    if (foreignObject) {
      foreignObject.previousElementSibling!.classList.add("searched_node");
    }
  });

  nodes[selectedNode].classList.add("highlight_node");
};
