import Editor, { loader } from "@monaco-editor/react";
import { JSON_TEMPLATE } from "@/constants/json";
import { useApp } from "@/store/useApp";

loader.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs",
  },
});

const editorOptions = {
  formatOnPaste: true,
  formatOnType: true,
  minimap: {
    enabled: false,
  },
};

export default function MonacoEditor() {
  const setError = useApp((state) => state.setError);
  return (
    <Editor
      className="h-screen md:h-full"
      defaultLanguage="json"
      height="100%"
      options={editorOptions}
      onValidate={(errors) => setError(errors[0]?.message)}
      defaultValue={JSON_TEMPLATE}
    />
  );
}
