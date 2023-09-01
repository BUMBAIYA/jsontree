import { useCallback, useEffect, useMemo } from "react";
import { useTree } from "@/store/useTree";

const useToggleHide = () => {
  const collapsedNodes = useTree((state) => state.collapsedNodes);
  const collapsedEdges = useTree((state) => state.collapsedEdges);

  const nodeList = useMemo(
    () => collapsedNodes.map((id) => `[id$="node-${id}"]`),
    [collapsedNodes],
  );
  const edgeList = useMemo(
    () => collapsedEdges.map((id) => `[class$="edge-${id}"]`),
    [collapsedEdges],
  );

  const validateHiddenNodes = useCallback(() => {
    const hiddenItems = document.body.querySelectorAll(".hide_node");
    hiddenItems.forEach((item) => item.classList.remove("hide_node"));

    if (nodeList.length) {
      const selectedNodes = document.body.querySelectorAll(nodeList.join(","));
      selectedNodes.forEach((node) => node.classList.add("hide_node"));
    }

    if (edgeList.length) {
      const selectedEdges = document.body.querySelectorAll(edgeList.join(","));
      selectedEdges.forEach((edge) => edge.classList.add("hide_node"));
    }
  }, [nodeList, edgeList]);

  useEffect(() => {
    validateHiddenNodes();
  }, [validateHiddenNodes]);

  return { validateHiddenNodes };
};

export default useToggleHide;
