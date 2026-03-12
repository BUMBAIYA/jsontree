import { useApp } from "@/store/useApp";
import {
  CheckIcon,
  ErrorIcon,
  GithubIcon,
  JsonIcon,
  LogoIcon,
} from "@/components/icons";

export default function EditorInfobar() {
  const error = useApp((state) => state.error);
  const stats = useApp((state) => state.stats);
  const schemaMode = useApp((state) => state.schemaMode);
  const autoManualMode = useApp((state) => state.autoManualMode);
  const pendingTransform = useApp((state) => state.pendingTransform);
  const applyPendingTransform = useApp((state) => state.applyPendingTransform);

  return (
    <div className="flex h-7 w-full items-center justify-between gap-4 border-t border-zinc-300 bg-white px-2 text-xs dark:border-zinc-700 dark:bg-vsdark-500 md:px-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 dark:text-white">
          <span className="flex h-3.5 w-3.5">
            <LogoIcon />
          </span>
          JsonTree
        </div>
        <a
          href="https://github.com/BUMBAIYA/jsontree"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 hover:underline dark:text-white"
        >
          <span className="flex h-3.5 w-3.5">
            <GithubIcon />
          </span>
          Github
        </a>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        {autoManualMode && (
          <span className="hidden text-[10px] font-semibold text-yellow-700 dark:text-yellow-400 md:inline">
            Large JSON mode
          </span>
        )}
        {pendingTransform && (
          <button
            type="button"
            onClick={() => void applyPendingTransform()}
            className="rounded bg-yellow-400 px-2 py-[1px] font-semibold text-zinc-900 hover:bg-yellow-300"
          >
            Update graph
          </button>
        )}
        <span className="hidden h-4 items-center gap-1 dark:text-white sm:flex">
          <JsonIcon />
          JSON
        </span>
        {schemaMode && (
          <span className="rounded bg-yellow-400 px-2 py-[1px] text-[10px] font-semibold text-zinc-900">
            Schema mode
          </span>
        )}
        {stats && (
          <span className="hidden text-[10px] font-semibold text-zinc-600 dark:text-gray-300 md:inline">
            Nodes {stats.totalNodes} | Depth {stats.maxDepth}
          </span>
        )}
        <div className="flex w-max space-x-1.5">
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
