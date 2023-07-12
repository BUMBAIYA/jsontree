import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Montserrat } from "next/font/google";
import { PageSEO } from "@/components/PageSEO";
import { classNames } from "@/utility/classNames";
import { Allotment } from "allotment";
import MonacoEditor from "@/components/MonacoEditor";
import EditorInfobar from "@/components/EditorInfobar";
import "allotment/dist/style.css";
import { useApp } from "@/store/useApp";
import { JSON_TEMPLATE } from "@/constants/json";
import Navbar from "@/components/Navbar";

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
        <Navbar />
        <main className="flex h-[calc(100vh-84px)] flex-col md:flex-row">
          <Allotment defaultSizes={[100, 300]}>
            <Allotment.Pane
              className="h-full w-full md:w-1/2 lg:w-2/3"
              minSize={450}
              maxSize={700}
              visible
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
