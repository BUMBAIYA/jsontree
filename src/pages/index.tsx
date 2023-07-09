import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Montserrat } from "next/font/google";
import { PageSEO } from "@/components/PageSEO";
import { classNames } from "@/utility/classNames";
import { LogoIcon } from "@/components/Icons";
import { Allotment } from "allotment";
import MonacoEditor from "@/components/MonacoEditor";
import EditorInfobar from "@/components/MonacoEditor/EditorInfobar";
import "allotment/dist/style.css";
import { useApp } from "@/store/useApp";
import { JSON_TEMPLATE } from "@/constants/json";

const montserrat = Montserrat({ subsets: ["latin"] });

const TreeEditor = dynamic(() => import("@/components/TreeEditor"), {
  ssr: false,
});

export default function Home() {
  const { isReady } = useRouter();
  const setContents = useApp((state) => state.setContents);

  useEffect(() => {
    if (isReady) {
      setContents({ contents: JSON_TEMPLATE, hasChanges: false });
    }
  }, [isReady, setContents]);

  return (
    <div className="h-screen">
      <PageSEO
        title="Json Tree Viewer"
        description="Visualisation tool for json in a graph and tree form"
      />
      <div
        className={classNames(
          montserrat.className,
          "h-[calc(100vh-28px)] overflow-hidden",
        )}
      >
        <header className="flex h-14 items-center justify-between gap-2 border-b border-zinc-300 px-10 py-3">
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7">
              <LogoIcon />
            </div>
            <h1 className="text-base font-semibold">Json Tree</h1>
          </div>
        </header>
        <main className="flex h-[calc(100vh-84px)] flex-col md:flex-row">
          <Allotment defaultSizes={[100, 300]}>
            <Allotment.Pane
              className="h-full w-full md:w-1/2 lg:w-2/3"
              minSize={450}
              maxSize={700}
            >
              <MonacoEditor />
            </Allotment.Pane>
            <Allotment.Pane className="relative flex w-full items-center justify-center">
              <TreeEditor />
            </Allotment.Pane>
          </Allotment>
        </main>
      </div>
      <EditorInfobar />
    </div>
  );
}
