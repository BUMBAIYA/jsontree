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
          className="flex items-center space-x-1.5 hover:underline dark:text-white"
        >
          <span className="flex h-3.5 w-3.5">
            <GithubIcon />
          </span>
          Github
        </a>
      </div>
      <div className="flex items-center space-x-4">
        <span className="hidden h-4 items-center gap-1 dark:text-white sm:flex">
          <JsonIcon />
          JSON
        </span>
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
