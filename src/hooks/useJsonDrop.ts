import { useApp } from "@/store/useApp";
import { readFileText } from "@/utility/readFileText";
import { useCallback, useRef, useState } from "react";

export function useJsonDrop() {
  const dragDepth = useRef(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const setContents = useApp((state) => state.setContents);

  const onDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current++;
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => {
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) {
      setIsDragActive(false);
    }
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const onDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      dragDepth.current = 0;
      setIsDragActive(false);

      const file = event.dataTransfer.files[0];
      if (!file) return;

      const endsWithJson = /\.(jsonc?)$/i.test(file.name);
      const isJsonType = file.type === "application/json";

      const isJson = endsWithJson || isJsonType;
      if (!isJson) return;

      try {
        const text = await readFileText(file);
        setContents({ contents: text, hasChanges: true });
      } catch {
        // TODO: Show error toast
      }
    },
    [setContents],
  );

  return { isDragActive, onDragEnter, onDragLeave, onDragOver, onDrop };
}
