import { useTree } from "@/store/useTree";
import { FocusIcon, LogoIcon, ZoomInIcon, ZoomOutIcon } from "./Icons";

export default function Navbar() {
  const centerView = useTree((state) => state.centerView);
  const zoomIn = useTree((state) => state.zoomIn);
  const zoomOut = useTree((state) => state.zoomOut);
  return (
    <header className="flex h-14 items-center justify-between gap-2 border-b border-zinc-300 px-10 py-3">
      <div className="flex items-center gap-2">
        <div className="relative h-7 w-7">
          <LogoIcon />
        </div>
        <h1 className="text-base font-semibold">Json Tree</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="h-5 w-5"
          type="button"
          aria-label="Zoom In"
          onClick={zoomIn}
        >
          <ZoomInIcon />
        </button>
        <button
          className="h-5 w-5"
          type="button"
          aria-label="Zoom Out"
          onClick={zoomOut}
        >
          <ZoomOutIcon />
        </button>
        <button
          className="h-5 w-5"
          type="button"
          aria-label="focus to center"
          onClick={centerView}
        >
          <FocusIcon />
        </button>
      </div>
    </header>
  );
}
