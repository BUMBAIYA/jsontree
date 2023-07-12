import { useApp } from "@/store/useApp";
import { CheckIcon, ErrorIcon, JsonIcon } from "@/components/Icons";

export default function EditorInfobar() {
  const error = useApp((state) => state.error);
  return (
    <div className="flex h-7 w-full items-center justify-end gap-4 border-t border-zinc-300 px-2 text-xs">
      <span className="flex h-4 items-center gap-1">
        <JsonIcon />
        JSON
      </span>
      <div className="mr-10 flex w-max gap-1">
        {error ? (
          <>
            <div className="flex h-4 w-max items-center gap-1 text-red-600">
              <ErrorIcon />
            </div>
            <span className="text-red-600">Invalid JSON format</span>
          </>
        ) : (
          <>
            <div className="flex h-4 w-max items-center gap-1 text-green-600">
              <CheckIcon />
            </div>
            <span className="font-semibold text-green-600">
              Valid JSON format
            </span>
          </>
        )}
      </div>
    </div>
  );
}
