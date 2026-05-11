import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import { CancelIcon } from "@/components/icons";
import { useApp } from "@/store/useApp";

export type JsonStatsModalProps = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const TYPE_LABELS: Array<{
  id: "object" | "array" | "string" | "number" | "boolean" | "null";
  label: string;
}> = [
  { id: "object", label: "Objects" },
  { id: "array", label: "Arrays" },
  { id: "string", label: "Strings" },
  { id: "number", label: "Numbers" },
  { id: "boolean", label: "Booleans" },
  { id: "null", label: "Nulls" },
];

export function JsonStatsModal(props: JsonStatsModalProps) {
  const { isOpen, setOpen } = props;
  const stats = useApp((state) => state.stats);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 dark:bg-black dark:bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl rounded-lg bg-white p-4 ring-1 ring-gray-500/20 dark:bg-zinc-800 dark:text-gray-300 dark:ring-gray-100/20">
                <div className="flex items-center justify-between">
                  <span className="font-semibold dark:text-gray-200">
                    JSON Stats
                  </span>
                  <button
                    type="button"
                    className="h-5 w-5 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-200 dark:hover:text-yellow-400"
                    onClick={handleClose}
                  >
                    <CancelIcon />
                  </button>
                </div>

                {!stats ? (
                  <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700 dark:border-gray-600 dark:bg-zinc-700 dark:text-gray-200">
                    No stats yet. Validate/update JSON to generate stats.
                  </div>
                ) : (
                  <>
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <div className="rounded-md border border-gray-200 px-3 py-2 dark:border-gray-600">
                        <div className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
                          Total nodes
                        </div>
                        <div className="text-lg font-semibold">
                          {stats.totalNodes}
                        </div>
                      </div>
                      <div className="rounded-md border border-gray-200 px-3 py-2 dark:border-gray-600">
                        <div className="text-[11px] uppercase text-gray-500 dark:text-gray-400">
                          Max depth
                        </div>
                        <div className="text-lg font-semibold">
                          {stats.maxDepth}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm font-semibold dark:text-gray-200">
                        Types
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {TYPE_LABELS.map((type) => (
                          <div
                            key={type.id}
                            className="rounded-md border border-gray-200 px-3 py-2 dark:border-gray-600"
                          >
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {type.label}
                            </div>
                            <div className="text-base font-semibold">
                              {stats.typeCounts[type.id]}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm font-semibold dark:text-gray-200">
                        Most common keys
                      </div>
                      <div className="mt-2 max-h-56 overflow-auto rounded-md border border-gray-200 dark:border-gray-600">
                        {stats.topKeys.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No object keys found.
                          </div>
                        ) : (
                          stats.topKeys.map((entry) => (
                            <div
                              key={entry.key}
                              className="flex items-center justify-between border-b border-gray-100 px-3 py-2 text-sm last:border-b-0 dark:border-gray-700"
                            >
                              <span className="font-mono">{entry.key}</span>
                              <span className="font-semibold">
                                {entry.count}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
