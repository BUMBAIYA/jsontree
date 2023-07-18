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
    const hiddenItems = document.body.querySelectorAll(".hidden-node");
    hiddenItems.forEach((item) => item.classList.remove("hidden-node"));

    if (nodeList.length) {
      const selectedNodes = document.body.querySelectorAll(nodeList.join(","));
      selectedNodes.forEach((node) => node.classList.add("hidden-node"));
    }

    if (edgeList.length) {
      const selectedEdges = document.body.querySelectorAll(edgeList.join(","));
      selectedEdges.forEach((edge) => edge.classList.add("hidden-node"));
    }
  }, [nodeList, edgeList]);

  useEffect(() => {
    validateHiddenNodes();
  }, [validateHiddenNodes]);

  return { validateHiddenNodes };
};

export default useToggleHide;
