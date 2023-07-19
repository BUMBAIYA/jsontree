import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Edge, EdgeProps, ElkRoot, NodeProps } from "reaflow";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { useTree } from "@/store/useTree";
import useToggleHide from "@/hooks/useToggleHide";
import { CustomNode } from "@/core/node";
import { useElementSize } from "@/hooks/useElementSize";
import { useStored } from "@/store/useStored";

const Canvas = dynamic(() => import("reaflow").then((r) => r.Canvas));

export default function TreeEditor() {
  const loading = useTree((state) => state.loading);
  const { validateHiddenNodes } = useToggleHide();
  const setLoading = useTree((state) => state.setLoading);
  const setZoomPanPinch = useTree((state) => state.setZoomPanPinch);
  const centerView = useTree((state) => state.centerView);
  const lightmode = useStored((state) => state.lightmode);

  const direction = useTree((state) => state.direction);
  const nodes = useTree((state) => state.nodes);
  const edges = useTree((state) => state.edges);

  const [paneWidth, setPaneWidth] = useState(2000);
  const [paneHeight, setPaneHeight] = useState(2000);

  const [editorContainerRef, editorSize] = useElementSize();

  const onInit = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      setZoomPanPinch(ref);
    },
    [setZoomPanPinch],
  );

  const onLayoutChange = useCallback(
    (layout: ElkRoot) => {
      if (layout.width && layout.height) {
        const areaSize = layout.width * layout.height;
        const changeRatio = Math.abs(
          (areaSize * 100) / (paneWidth * paneHeight) - 100,
        );

        setPaneWidth(layout.width + 50);
        setPaneHeight((layout.height as number) + 50);

        setTimeout(() => {
          setLoading(false);
          validateHiddenNodes();
          window.requestAnimationFrame(() => {
            if (changeRatio > 70 || false) centerView();
          });
        });
      }
    },
    [centerView, paneHeight, paneWidth, setLoading, validateHiddenNodes],
  );

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
        <div className="pointer-events-none absolute inset-0 left-0 top-0 z-50 flex items-center justify-center bg-white dark:bg-vsdark-500 dark:text-white">
          <div className="text-base">
            <span>Building graph...</span>
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
              display: loading ? "none" : "block",
            }}
          >
            <Canvas
              className="jsontree-canvas"
              nodes={nodes}
              edges={edges}
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
