import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useMemo, useState } from "react";
import { CancelIcon } from "@/components/icons";
import { useApp } from "@/store/useApp";
import { importRemoteJson } from "@/utility/remoteJsonImport";

export type ImportJsonUrlModalProps = {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const examples = [
  "https://jsonplaceholder.typicode.com/users/1",
  "https://raw.githubusercontent.com/…/main/data.json",
  "https://registry.npmjs.org/zod/latest",
];

export function ImportJsonUrlModal(props: ImportJsonUrlModalProps) {
  const { isOpen, setOpen } = props;
  const setContents = useApp((state) => state.setContents);

  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canImport = useMemo(
    () => source.trim().length > 0 && !loading,
    [loading, source],
  );

  const handleClose = () => {
    setLoading(false);
    setError("");
    setOpen(false);
  };

  const handleImport = async () => {
    const value = source.trim();
    if (!value) {
      setError("Paste a full https URL that returns JSON.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await importRemoteJson(value);
      await setContents({
        contents: payload.pretty,
        hasChanges: true,
        skipUpdate: false,
      });

      handleClose();
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to import JSON.";
      setError(message);
    } finally {
      setLoading(false);
    }
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
                    Import JSON from URL
                  </span>
                  <button
                    type="button"
                    className="h-5 w-5 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-200 dark:hover:text-yellow-400"
                    onClick={handleClose}
                  >
                    <CancelIcon />
                  </button>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="import-json-url"
                    className="block text-sm font-medium dark:text-gray-200"
                  >
                    HTTPS URL (must return JSON)
                  </label>
                  <input
                    id="import-json-url"
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    value={source}
                    onChange={(event) => setSource(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && canImport) {
                        event.preventDefault();
                        void handleImport();
                      }
                    }}
                    placeholder="https://…"
                    className="mt-2 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-yellow-400 dark:bg-vsdark-500 dark:text-gray-200 dark:ring-0 dark:focus:ring-1 sm:text-sm sm:leading-6"
                    autoFocus
                  />
                </div>

                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  Fetches in your browser from the URL you provide. If you use a
                  normal GitHub file page, use a{" "}
                  <span className="font-mono">blob</span> or{" "}
                  <span className="font-mono">tree</span> link to that file, or
                  paste the{" "}
                  <span className="font-mono">raw.githubusercontent.com</span>{" "}
                  link. The host must allow CORS.
                </p>

                <div className="mt-3 rounded-md bg-gray-100 px-3 py-2 text-xs text-gray-700 dark:bg-zinc-700 dark:text-gray-200">
                  <span className="font-semibold">Examples:</span>{" "}
                  {examples.join(" · ")}
                </div>

                {error && (
                  <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                    {error}
                  </div>
                )}

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleImport()}
                    disabled={!canImport}
                    className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Importing…" : "Import JSON"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
