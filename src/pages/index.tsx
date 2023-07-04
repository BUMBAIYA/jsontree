import { classNames } from "@/utility/classNames";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={classNames(montserrat.className, "min-h-screen")}>
      <h1 className="text-6xl font-semibold">JSON Viewer</h1>
      <p className="text-base">JSON visualization tool as a graph and tree</p>
    </main>
  );
}
