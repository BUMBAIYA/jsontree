import { FocusIcon, ZoomInIcon, ZoomOutIcon } from "@/components/Icons";
import { useTree } from "@/store/useTree";

export default function Tools() {
  const centerView = useTree((state) => state.centerView);
  const zoomIn = useTree((state) => state.zoomIn);
  const zoomOut = useTree((state) => state.zoomOut);
  return (
    <div className="flex items-center gap-2">
      <button
        className="h-8 w-8 rounded-md p-[5px] hover:bg-gray-200"
        type="button"
        aria-label="Zoom In"
        onClick={zoomIn}
      >
        <ZoomInIcon />
      </button>
      <button
        className="h-8 w-8 rounded-md p-[5px] hover:bg-gray-200"
        type="button"
        aria-label="Zoom Out"
        onClick={zoomOut}
      >
        <ZoomOutIcon />
      </button>
      <button
        className="h-8 w-8 rounded-md p-[5px] hover:bg-gray-200"
        type="button"
        aria-label="focus to center"
        onClick={centerView}
      >
        <FocusIcon />
      </button>
    </div>
  );
}
