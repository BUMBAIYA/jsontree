import { useApp } from "@/store/useApp";
import { CheckIcon, ErrorIcon, JsonIcon, LogoIcon } from "@/components/Icons";

export default function EditorInfobar() {
  const error = useApp((state) => state.error);
  return (
    <div className="flex h-7 w-full items-center justify-between gap-4 border-t border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-vsdark-500 md:px-10">
      <div className="flex items-center gap-1 dark:text-white">
        <span className="flex h-5 w-5 gap-1">
          <LogoIcon />
        </span>
        JsonTree
      </div>
      <div className="flex items-center gap-4">
        <span className="flex h-4 items-center gap-1 dark:text-white">
          <JsonIcon />
          JSON
        </span>
        <div className="flex w-max gap-1">
          {error ? (
            <>
              <div className="flex h-4 w-max items-center gap-1 text-red-600 dark:text-red-400">
                <ErrorIcon />
              </div>
              <span className="text-red-600 dark:text-red-400">
                Invalid JSON format
              </span>
            </>
          ) : (
            <>
              <div className="flex h-4 w-max items-center gap-1 text-green-600 dark:text-green-400">
                <CheckIcon />
              </div>
              <span className="font-semibold text-green-600 dark:text-green-400">
                Valid JSON format
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
