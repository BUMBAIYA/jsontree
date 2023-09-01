import { useFocusNode } from "@/hooks/useFocusNode";
import { getHotkeyHandler } from "@/hooks/useHotKeys";

export function Searchbar() {
  const [searchValue, setValue, skip, nodeCount, currentNode] = useFocusNode();
  return (
    <div
      tabIndex={0}
      className="flex max-w-[165px] items-center gap-2 rounded-md border border-gray-300 px-2 ring-0 ring-gray-200/40 focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400 focus:border dark:border-gray-600 dark:bg-zinc-800 sm:max-w-[200px] sm:px-4"
    >
      <input
        type="search"
        placeholder="Search Node"
        className="w-full rounded-md border-none px-0 pr-12 text-xs ring-0 focus:ring-0 dark:bg-zinc-800 dark:text-white"
        value={searchValue}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={getHotkeyHandler([["Enter", skip]])}
      />
      {nodeCount > 0 && (
        <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
          <span>{currentNode + 1}</span>/<span>{nodeCount}</span>
        </div>
      )}
    </div>
  );
}
