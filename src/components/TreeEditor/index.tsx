import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import { Edge, EdgeProps, ElkRoot, NodeProps } from "reaflow";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { useTree } from "@/store/useTree";
import { CustomNode } from "@/core/node";
import { useElementSize } from "@/hooks/useElementSize";
import { useStored } from "@/store/useStored";

const Canvas = dynamic(() => import("reaflow").then((r) => r.Canvas));

export default function TreeEditor() {
  const loading = useTree((state) => state.loading);
  const loadedNodes = useTree((state) => state.loadedNodes);
  const totalNodes = useTree((state) => state.totalNodes);
  const setZoomPanPinch = useTree((state) => state.setZoomPanPinch);
  const lightmode = useStored((state) => state.lightmode);

  const direction = useTree((state) => state.direction);
  const nodes = useTree((state) => state.nodes);
  const edges = useTree((state) => state.edges);
  const collapsedNodes = useTree((state) => state.collapsedNodes);
  const collapsedEdges = useTree((state) => state.collapsedEdges);

  const [paneWidth, setPaneWidth] = useState(2000);
  const [paneHeight, setPaneHeight] = useState(2000);

  const [editorContainerRef, editorSize] = useElementSize();

  const renderNodes = useMemo(() => {
    const hiddenNodeIds = new Set(collapsedNodes);
    return nodes.filter((node) => !hiddenNodeIds.has(node.id));
  }, [collapsedNodes, nodes]);

  const renderEdges = useMemo(() => {
    const hiddenNodeIds = new Set(collapsedNodes);
    const hiddenEdgeIds = new Set(collapsedEdges);

    return edges.filter((edge) => {
      if (hiddenEdgeIds.has(edge.id)) return false;
      if (edge.from && hiddenNodeIds.has(edge.from)) return false;
      if (edge.to && hiddenNodeIds.has(edge.to)) return false;
      return true;
    });
  }, [collapsedEdges, collapsedNodes, edges]);

  const onInit = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      setZoomPanPinch(ref);
    },
    [setZoomPanPinch],
  );

  const onLayoutChange = useCallback((layout: ElkRoot) => {
    if (layout.width && layout.height) {
      setPaneWidth(layout.width + 50);
      setPaneHeight((layout.height as number) + 50);
    }
  }, []);

  const memoizedNode = useCallback(
    (props: JSX.IntrinsicAttributes & NodeProps<any>) => (
      <CustomNode {...props} animated={false} isLightMode={lightmode} />
    ),
    [lightmode],
  );

  const memoizedEdge = useCallback(
    (props: JSX.IntrinsicAttributes & Partial<EdgeProps>) => (
      <Edge {...props} containerClassName={`edge-${props.id}`} />
    ),
    [],
  );

  return (
    <>
      {loading && (
        <div className="bg-white/85 pointer-events-none absolute right-2 top-2 z-50 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm dark:bg-vsdark-500/90 dark:text-gray-200">
          <div className="flex items-center gap-2">
            <span>Building graph</span>
            {totalNodes > 0 && (
              <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                {loadedNodes}/{totalNodes}
              </span>
            )}
          </div>
        </div>
      )}
      <div
        ref={editorContainerRef}
        onContextMenu={(e) => e.preventDefault()}
        className="absolute h-[calc(100vh-84px)] w-full active:!cursor-move dark:bg-vsdark-500"
      >
        <div className="absolute right-1 top-1 z-20 rounded-md p-1 text-xs dark:text-gray-300">
          <span>
            {editorSize.width} X {editorSize.height}
          </span>
        </div>
        <TransformWrapper
          maxScale={2}
          minScale={0.05}
          initialScale={0.4}
          wheel={{ step: 0.04 }}
          zoomAnimation={{ animationType: "linear" }}
          doubleClick={{ disabled: true }}
          onInit={onInit}
          onPanning={(ref) =>
            ref.instance.wrapperComponent?.classList.add("pointer-events-none")
          }
          onPanningStop={(ref) =>
            ref.instance.wrapperComponent?.classList.remove(
              "pointer-events-none",
            )
          }
        >
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              display: "block",
            }}
          >
            <Canvas
              className="jsontree-canvas"
              nodes={renderNodes}
              edges={renderEdges}
              maxHeight={paneHeight}
              maxWidth={paneWidth}
              height={paneHeight}
              width={paneWidth}
              direction={direction}
              onLayoutChange={onLayoutChange}
              node={memoizedNode}
              edge={memoizedEdge}
              key={direction}
              pannable={false}
              zoomable={false}
              animated={false}
              readonly={true}
              dragEdge={null}
              dragNode={null}
              fit={true}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </>
  );
}
