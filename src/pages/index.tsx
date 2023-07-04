import { PageSEO } from "@/components/PageSEO";
import { classNames } from "@/utility/classNames";
import { Montserrat } from "next/font/google";
import { LogoIcon } from "@/components/Icons";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={classNames(montserrat.className, "min-h-screen")}>
      <PageSEO
        title="JSON Viewer"
        description="Visualisation tool for json in a graph and tree form"
      />
      <div className="flex items-center gap-4 px-10 py-4">
        <div className="relative h-16 w-16">
          <LogoIcon />
        </div>
        <h1 className="text-6xl font-semibold">JSON Viewer</h1>
      </div>
      <p className="px-10 text-base">
        JSON visualization tool as a graph and tree (In Development).
      </p>
    </main>
  );
}
