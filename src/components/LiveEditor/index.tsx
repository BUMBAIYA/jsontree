import { Editor } from "@monaco-editor/react";
import { JSON_TEMPLATE } from "../data";

const editorOptions = {
  formatOnPaste: true,
  formatOnType: true,
  minimap: {
    enabled: false,
  },
};

export default function MonacoEditor() {
  return (
    <Editor
      className="h-screen md:h-full"
      defaultLanguage="json"
      height="100%"
      options={editorOptions}
      defaultValue={JSON_TEMPLATE}
    />
  );
}
