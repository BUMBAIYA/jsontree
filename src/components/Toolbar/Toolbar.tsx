import Tools from "@/components/Toolbar/Tools";
import Shortcuts from "./Shortcuts";
import { Searchbar } from "../Searchbar";

export function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <Searchbar />
      <Tools />
      <Shortcuts />
    </div>
  );
}
