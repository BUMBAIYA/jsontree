import { Montserrat } from "next/font/google";
import { Editor } from "@monaco-editor/react";
import { PageSEO } from "@/components/PageSEO";
import { classNames } from "@/utility/classNames";
import { LogoIcon } from "@/components/Icons";
import { JSON_TEMPLATE } from "@/components/data";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="h-screen">
      <PageSEO
        title="JSON Viewer"
        description="Visualisation tool for json in a graph and tree form"
      />
      <div
        className={classNames(
          montserrat.className,
          "h-[calc(100vh-58px)]  overflow-hidden",
        )}
      >
        <header className="flex items-center gap-2 border border-zinc-200 px-10 py-3">
          <div className="relative h-7 w-7">
            <LogoIcon />
          </div>
          <h1 className="text-base font-semibold">Json Tree</h1>
        </header>
        <main className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 lg:w-2/3">
            <Editor
              className="h-screen md:h-full"
              height="90vh"
              defaultLanguage="json"
              defaultValue={JSON_TEMPLATE}
            />
          </div>
          <div className="flex w-full items-center justify-center">
            <span>Editor (in Development)</span>
          </div>
        </main>
      </div>
      <footer className="z-[999] w-full border border-zinc-200 bg-white">
        <div className="px-16 py-4">JSON</div>
      </footer>
    </div>
  );
}
