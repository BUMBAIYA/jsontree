import Tools from "@/components/Toolbar/Tools";
import Shortcuts from "./Shortcuts";

export function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <Tools />
      <Shortcuts />
    </div>
  );
}
