import { JsonIcon } from "../Icons";

export default function EditorInfobar() {
  return (
    <div className="flex h-7 w-full items-center border-t border-zinc-300 px-2 text-xs">
      <span className="flex h-4 items-center gap-1">
        <JsonIcon />
        JSON
      </span>
    </div>
  );
}
