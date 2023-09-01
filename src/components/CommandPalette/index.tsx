import { useHotkeys } from "@/hooks/useHotKeys";
import { Transition, Dialog, Combobox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { LogoIcon, CancelIcon } from "@/components/Icons";

export default function CommandPalette() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const toggleCommandPalette = () => {
    setIsOpenModal((prev) => !prev);
  };

  useHotkeys([["ctrl,/", toggleCommandPalette]]);

  return (
    <>
      <div className="ml-2 flex h-8 items-center gap-1 rounded-md border border-gray-300 text-gray-700">
        <span className="select-none px-2 text-sm font-medium">
          <kbd>ctrl+/</kbd>
        </span>
        <button
          className="h-7 rounded-md border-l px-2 py-[5px] hover:bg-gray-200"
          type="button"
          aria-label="Command palette"
          onClick={toggleCommandPalette}
        >
          <CommandPaletteIcon />
        </button>
      </div>
      <Transition appear show={isOpenModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsOpenModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-5" />
          </Transition.Child>

          <div className="fixed inset-0 top-12">
            <div className="flex justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white pb-4 text-left align-middle shadow-xl ring-1 ring-gray-500/20 transition-all">
                  <Combobox>
                    <div className="flex items-center gap-2 px-4 py-2">
                      {/* <div className="w-5 text-gray-600">
                        <SearchIcon />
                      </div> */}
                      <span className="flex items-center gap-2">
                        <span className="h-5 w-5">
                          <LogoIcon />
                        </span>
                        Jsontree
                      </span>
                      <span>/</span>
                      <div className="w-full">
                        <Combobox.Input
                          className="w-full max-w-full border-0 focus:ring-0"
                          placeholder="Search..."
                        />
                      </div>
                      <button
                        className="w-8 rounded-md p-[5px] text-gray-500 hover:text-gray-600"
                        onClick={toggleCommandPalette}
                      >
                        <CancelIcon />
                      </button>
                    </div>
                    <div className="px-6 py-2">
                      <div className="text-xs text-gray-700">
                        <span>Tip:</span>Type
                        <kbd className="mx-1 rounded-md border border-gray-500 px-2 py-1">
                          ?
                        </kbd>
                        for help and tips
                      </div>
                    </div>
                    <Combobox.Options>
                      <Combobox.Option value="one">
                        {({ active }) => (
                          <div
                            className={`${
                              active ? "bg-red-600" : ""
                            } px-4 py-2`}
                          >
                            one
                          </div>
                        )}
                      </Combobox.Option>
                      <Combobox.Option value="two">
                        {({ active }) => (
                          <button
                            className={`${
                              active ? "bg-red-600" : ""
                            } px-4 py-2`}
                            onClick={toggleCommandPalette}
                          >
                            Toggle Editor
                          </button>
                        )}
                      </Combobox.Option>
                      <Combobox.Option value="three">
                        {({ active }) => (
                          <div
                            className={`${
                              active ? "bg-red-600" : ""
                            } px-4 py-2`}
                          >
                            Three
                          </div>
                        )}
                      </Combobox.Option>
                    </Combobox.Options>
                  </Combobox>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export function CommandPaletteIcon() {
  return (
    <svg
      stroke="none"
      fill="currentColor"
      aria-hidden="true"
      height="100%"
      viewBox="0 0 16 16"
      version="1.1"
      width="100%"
    >
      <path d="m6.354 8.04-4.773 4.773a.75.75 0 1 0 1.061 1.06L7.945 8.57a.75.75 0 0 0 0-1.06L2.642 2.206a.75.75 0 0 0-1.06 1.061L6.353 8.04ZM8.75 11.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5Z"></path>
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg
      stroke="none"
      fill="currentColor"
      aria-hidden="true"
      height="100%"
      viewBox="0 0 16 16"
      version="1.1"
      width="100%"
    >
      <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"></path>
    </svg>
  );
}
