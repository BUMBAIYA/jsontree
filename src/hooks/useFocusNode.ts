import { useTree } from "@/store/useTree";
import { useEffect, useState } from "react";
import { useDebounceValue } from "./useDebounceValue";
import {
  searchQuery,
  cleanupHighlight,
  highlightMatchedNodes,
} from "@/core/graph/search";

let TREE_EDITOR: HTMLElement | null = null;

export function useFocusNode() {
  const zoomPanPinch = useTree((state) => state.zoomPanPinch);
  const [selectedNode, setSelectedNode] = useState(0);
  const [nodeCount, setNodeCount] = useState(0);
  const [value, setValue] = useState("");
  const [debounceValue] = useDebounceValue(value);

  const skip = () => setSelectedNode((prev) => prev + 1);

  if (typeof window !== "undefined") {
    TREE_EDITOR = document.getElementById("tree-editor")!;
  }

  useEffect(() => {
    if (!zoomPanPinch) return;
    const matchedNodes: NodeListOf<Element> = searchQuery(
      `span[data-key*='${debounceValue}' i]`,
    );
    const ref = zoomPanPinch.instance.wrapperComponent;
    const matchedNode: Element | null = matchedNodes[selectedNode] || null;

    cleanupHighlight();

    if (ref && matchedNode && matchedNode.parentElement) {
      const newScale = 0.8;
      const x = Number(matchedNode.getAttribute("data-x"));
      const y = Number(matchedNode.getAttribute("data-y"));

      const newPositionX =
        (ref.offsetLeft - x) * newScale +
        ref.clientWidth / 2 -
        matchedNode.getBoundingClientRect().width;

      const newPositionY =
        (ref.offsetLeft - y) * newScale +
        ref.clientHeight / 5 -
        matchedNode.getBoundingClientRect().height;

      highlightMatchedNodes(matchedNodes, selectedNode);
      setNodeCount(matchedNodes.length);

      zoomPanPinch.setTransform(newPositionX, newPositionY, newScale);
    } else {
      setSelectedNode(0);
      setNodeCount(0);
    }

    return () => {
      if (!value) {
        setSelectedNode(0);
        setNodeCount(0);
      }
    };
  }, [zoomPanPinch, debounceValue, selectedNode, value]);

  return [value, setValue, skip, nodeCount, selectedNode] as const;
}
