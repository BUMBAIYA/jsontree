import { useState } from "react";
import {
  DownloadIcon,
  FocusIcon,
  MoonIcon,
  SunIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@/components/Icons";
import { useTree } from "@/store/useTree";
import { useHotkeys } from "@/hooks/useHotKeys";
import { useStored } from "@/store/useStored";
import { DownloadImageModal } from "@/components/modals/DownloadImageModal";

export default function Tools() {
  const [isDownloadModalOpen, setIsDownloadModal] = useState<boolean>(false);
  const centerView = useTree((state) => state.centerView);
  const zoomIn = useTree((state) => state.zoomIn);
  const zoomOut = useTree((state) => state.zoomOut);
  const lightmode = useStored((state) => state.lightmode);
  const setLightTheme = useStored((state) => state.setLightTheme);

  useHotkeys([
    ["mod,shift,+", zoomIn],
    ["mod,shift,-", zoomOut],
    ["mod,shift,c", centerView],
  ]);

  return (
    <div className="hidden items-center gap-2 md:flex">
      <button
        className="h-8 w-8 rounded-md border border-gray-300 p-[5px] text-gray-700 hover:bg-gray-200 dark:border-gray-500 dark:bg-vsdark-500 dark:text-gray-300 dark:hover:border-yellow-400 dark:hover:text-yellow-400"
        type="button"
        aria-label="Zoom In"
        onClick={() => setIsDownloadModal(true)}
      >
        <DownloadIcon />
      </button>
      <DownloadImageModal
        isOpen={isDownloadModalOpen}
        setOpen={setIsDownloadModal}
      />
      <button
        className="hidden h-8 w-8 rounded-md border border-gray-300 p-[5px] text-gray-700 hover:bg-gray-200 dark:border-gray-500 dark:bg-vsdark-500 dark:text-gray-300 dark:hover:border-yellow-400 dark:hover:text-yellow-400 md:inline-block"
        type="button"
        aria-label="Zoom In"
        onClick={zoomIn}
      >
        <ZoomInIcon />
      </button>
      <button
        className="hidden h-8 w-8 rounded-md border border-gray-300 p-[5px] text-gray-700 hover:bg-gray-200 dark:border-gray-500 dark:bg-vsdark-500 dark:text-gray-300 dark:hover:border-yellow-400 dark:hover:text-yellow-400 md:inline-block"
        type="button"
        aria-label="Zoom Out"
        onClick={zoomOut}
      >
        <ZoomOutIcon />
      </button>
      <button
        className="h-8 w-8 rounded-md border border-gray-300 p-[5px] text-gray-700 hover:bg-gray-200 dark:border-gray-500 dark:bg-vsdark-500 dark:text-gray-300 dark:hover:border-yellow-400 dark:hover:text-yellow-400"
        type="button"
        aria-label="focus to center"
        onClick={centerView}
      >
        <FocusIcon />
      </button>
      <button
        className="h-8 w-8 rounded-md border border-gray-300 p-[5px] text-gray-700 hover:bg-gray-200 dark:border-gray-500 dark:bg-vsdark-500 dark:text-gray-300 dark:hover:border-yellow-400 dark:hover:text-yellow-400"
        type="button"
        aria-label="Toggle theme"
        onClick={() => setLightTheme(!lightmode)}
      >
        {lightmode ? <MoonIcon /> : <SunIcon />}
      </button>
    </div>
  );
}
