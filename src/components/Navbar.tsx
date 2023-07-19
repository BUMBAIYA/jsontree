import { LogoIcon } from "./Icons";
import { Toolbar } from "./Toolbar/Toolbar";

export default function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between gap-2 border-b border-zinc-300 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-vsdark-500 md:px-10">
      <div className="flex items-center gap-2">
        <div className="relative h-7 w-7 dark:text-white">
          <LogoIcon />
        </div>
        <h1 className="hidden text-base font-semibold dark:text-white md:inline">
          Json Tree
        </h1>
      </div>
      <Toolbar />
    </header>
  );
}
