import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { getNextDirection } from "@/core/graph/getNextDirection";
import { useHotkeys } from "@/hooks/useHotKeys";
import { useTree } from "@/store/useTree";
import { ChevronDownIcon } from "@/components/Icons";

export default function Shortcuts() {
  const fullscreen = useTree((state) => state.fullscreen);
  const toggleFullscreen = useTree((state) => state.toggleFullscreen);
  const centerView = useTree((state) => state.centerView);
  const zoomIn = useTree((state) => state.zoomIn);
  const zoomOut = useTree((state) => state.zoomOut);
  const direction = useTree((state) => state.direction);
  const setDirection = useTree((state) => state.setDirection);

  const toggleEditor = () => toggleFullscreen(!fullscreen);

  const toggleDirection = () => {
    const nextDirection = getNextDirection(direction);
    setDirection(nextDirection);
  };

  useHotkeys([
    ["mod,shift,E", toggleEditor],
    ["mod,shift,D", toggleDirection],
  ]);

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="inline-flex h-8 items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 hover:bg-gray-200">
        Shortcuts
        <div className="-mr-1 ml-2 h-4 w-4">
          <ChevronDownIcon />
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-gray-900 text-white" : "text-gray-900"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={toggleEditor}
              >
                Toggle Editor
                <kbd
                  className={`ml-2 rounded-md border border-gray-200 p-1 text-xs ${
                    active
                      ? "border-gray-100 bg-yellow-300 text-gray-900"
                      : "bg-gray-200"
                  }`}
                >
                  cltrl+shift+E
                </kbd>
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-gray-900 text-white" : "text-gray-900"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={toggleDirection}
              >
                Rotate grid
                <kbd
                  className={`ml-2 rounded-md border border-gray-200 p-1 text-xs ${
                    active
                      ? "border-gray-100 bg-yellow-300 text-gray-900"
                      : "bg-gray-200"
                  }`}
                >
                  cltrl+shift+D
                </kbd>
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-gray-900 text-white" : "text-gray-900"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={centerView}
              >
                Center View
                <kbd
                  className={`ml-2 rounded-md border border-gray-200 p-1 text-xs ${
                    active
                      ? "border-gray-100 bg-yellow-300 text-gray-900"
                      : "bg-gray-200"
                  }`}
                >
                  cltrl+shift+C
                </kbd>
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-gray-900 text-white" : "text-gray-900"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={zoomIn}
              >
                Zoom In
                <kbd
                  className={`ml-2 rounded-md border border-gray-200 p-1 text-xs ${
                    active
                      ? "border-gray-100 bg-yellow-300 text-gray-900"
                      : "bg-gray-200"
                  }`}
                >
                  cltrl+shift++
                </kbd>
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-gray-900 text-white" : "text-gray-900"
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                onClick={zoomOut}
              >
                Zoom Out
                <kbd
                  className={`ml-2 rounded-md border border-gray-200 p-1 text-xs ${
                    active
                      ? "border-gray-100 bg-yellow-300 text-gray-900"
                      : "bg-gray-200"
                  }`}
                >
                  cltrl+shift+-
                </kbd>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
