import { useState } from "react";
import { JsonIcon } from "@/components/icons";
import { ImportPackageJsonModal } from "@/components/modals/ImportPackageJsonModal";
import { JsonStatsModal } from "@/components/modals/JsonStatsModal";
import { useApp } from "@/store/useApp";
import Tools from "@/components/Toolbar/Tools";
import Shortcuts from "./Shortcuts";
import { Searchbar } from "../Searchbar";

export function Toolbar() {
  const [isImportModalOpen, setIsImportModal] = useState(false);
  const [isStatsModalOpen, setIsStatsModal] = useState(false);
  const schemaMode = useApp((state) => state.schemaMode);
  const toggleSchemaMode = useApp((state) => state.toggleSchemaMode);
  const openImportModal = () => setIsImportModal(true);
  const openStatsModal = () => setIsStatsModal(true);

  return (
    <div className="flex items-center gap-2">
      <Searchbar />
      <button
        type="button"
        aria-label="Import package.json"
        onClick={openImportModal}
        className="inline-flex h-8 w-8 items-center justify-center gap-1 rounded-md border border-gray-300 p-0 text-sm text-gray-700 hover:bg-gray-200 dark:border-gray-500 dark:bg-vsdark-500 dark:text-gray-300 dark:hover:border-yellow-400 dark:hover:text-yellow-400 sm:w-auto sm:px-2 sm:py-1"
      >
        <span className="h-4 w-4">
          <JsonIcon />
        </span>
        <span className="hidden sm:inline">Import</span>
      </button>
      <button
        type="button"
        aria-label={
          schemaMode ? "Switch to data mode" : "Switch to schema mode"
        }
        onClick={() => void toggleSchemaMode()}
        className={`inline-flex h-8 items-center justify-center rounded-md border px-2 py-1 text-sm ${
          schemaMode
            ? "border-yellow-400 bg-yellow-400 text-zinc-900"
            : "border-gray-300 text-gray-700 hover:bg-gray-200 dark:border-gray-500 dark:bg-vsdark-500 dark:text-gray-300 dark:hover:border-yellow-400 dark:hover:text-yellow-400"
        }`}
      >
        {schemaMode ? "Data" : "Schema"}
      </button>
      <button
        type="button"
        aria-label="Open JSON stats"
        onClick={openStatsModal}
        className="inline-flex h-8 items-center justify-center rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:border-gray-500 dark:bg-vsdark-500 dark:text-gray-300 dark:hover:border-yellow-400 dark:hover:text-yellow-400"
      >
        Stats
      </button>
      <Tools />
      <Shortcuts
        onOpenImportModal={openImportModal}
        onOpenStatsModal={openStatsModal}
        onToggleSchemaMode={() => void toggleSchemaMode()}
      />
      <ImportPackageJsonModal
        isOpen={isImportModalOpen}
        setOpen={setIsImportModal}
      />
      <JsonStatsModal isOpen={isStatsModalOpen} setOpen={setIsStatsModal} />
    </div>
  );
}
