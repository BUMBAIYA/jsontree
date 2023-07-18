import { FocusIcon, ZoomInIcon, ZoomOutIcon } from "@/components/Icons";
import { useTree } from "@/store/useTree";
import { useHotkeys } from "@/hooks/useHotKeys";

export default function Tools() {
  const centerView = useTree((state) => state.centerView);
  const zoomIn = useTree((state) => state.zoomIn);
  const zoomOut = useTree((state) => state.zoomOut);

  useHotkeys([
    ["mod,shift,+", zoomIn],
    ["mod,shift,-", zoomOut],
    ["mod,shift,c", centerView],
  ]);

  return (
    <div className="flex items-center gap-2">
      <button
        className="hidden h-8 w-8 rounded-md border border-gray-300 p-[5px] text-gray-700 hover:bg-gray-200 md:inline-block"
        type="button"
        aria-label="Zoom In"
        onClick={zoomIn}
      >
        <ZoomInIcon />
      </button>
      <button
        className="hidden h-8 w-8 rounded-md border border-gray-300 p-[5px] text-gray-700 hover:bg-gray-200 md:inline-block"
        type="button"
        aria-label="Zoom Out"
        onClick={zoomOut}
      >
        <ZoomOutIcon />
      </button>
      <button
        className="h-8 w-8 rounded-md border border-gray-300 p-[5px] text-gray-700 hover:bg-gray-200"
        type="button"
        aria-label="focus to center"
        onClick={centerView}
      >
        <FocusIcon />
      </button>
    </div>
  );
}
