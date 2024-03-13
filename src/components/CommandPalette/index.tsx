import { Fragment, useState } from "react";
import { useHotkeys } from "@/hooks/useHotKeys";
import { Transition, Dialog, Combobox } from "@headlessui/react";
import { LogoIcon, CancelIcon, CommandPaletteIcon } from "@/components/Icons";

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
