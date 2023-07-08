import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { useTree } from "@/store/useTree";
import useToggleHide from "@/hooks/useToggleHide";
import { useCallback, useState } from "react";

export default function TreeEditor() {
  const loading = useTree((state) => state.loading);
  const { validateHiddenNodes } = useToggleHide();
  const setLoading = useTree((state) => state.setLoading);
  const setZoomPanPinch = useTree((state) => state.setZoomPanPinch);
  const centerView = useTree((state) => state.centerView);
  const setSelectedNode = useTree((state) => state.setSelectedNode);

  const direction = useTree((state) => state.direction);
  const nodes = useTree((state) => state.nodes);
  const edges = useTree((state) => state.edges);

  const [paneWidth, setPaneWidth] = useState(2000);
  const [paneHeight, setPaneHeight] = useState(2000);

  const onInit = useCallback(
    (ref: ReactZoomPanPinchRef) => {
      setZoomPanPinch(ref);
    },
    [setZoomPanPinch],
  );

  return (
    <>
      {loading && (
        <div className="pointer-events-none absolute inset-0 left-0 top-0 z-50 flex items-center justify-center bg-white">
          <div className="text-base">
            <span>Loading tree...</span>
          </div>
        </div>
      )}
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
          ref.instance.wrapperComponent?.classList.remove("pointer-events-none")
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
          <div></div>
        </TransformComponent>
      </TransformWrapper>
    </>
  );
}
