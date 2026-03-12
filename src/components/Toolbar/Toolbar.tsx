import { useState } from "react";
import { JsonIcon } from "@/components/icons";
import { ImportPackageJsonModal } from "@/components/modals/ImportPackageJsonModal";
import Tools from "@/components/Toolbar/Tools";
import Shortcuts from "./Shortcuts";
import { Searchbar } from "../Searchbar";

export function Toolbar() {
  const [isImportModalOpen, setIsImportModal] = useState(false);
  const openImportModal = () => setIsImportModal(true);

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
      <Tools />
      <Shortcuts onOpenImportModal={openImportModal} />
      <ImportPackageJsonModal
        isOpen={isImportModalOpen}
        setOpen={setIsImportModal}
      />
    </div>
  );
}
