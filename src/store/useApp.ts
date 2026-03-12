import { create } from "zustand";
import debounce from "lodash.debounce";
import { contentToJson } from "@/core/json/jsonAdapter";
import { useJson } from "@/store/useJson";
import { useStored } from "@/store/useStored";
import { JSON_TEMPLATE } from "@/constants/json";

type SetContents = {
  contents?: string;
  hasChanges?: boolean;
  skipUpdate?: boolean;
};

interface JsonActions {
  getContents: () => string;
  getHasChanges: () => boolean;
  applyPendingTransform: () => Promise<void>;
  setError: (error: object | null | string) => void;
  setHasChanges: (hasChanges: boolean) => void;
  setContents: (data: SetContents) => void;
  clear: () => void;
}

const TRANSFORM_DEBOUNCE_MS = 800;
const LARGE_JSON_AUTO_MANUAL_THRESHOLD = 300 * 1024;

const initialStates = {
  contents: JSON_TEMPLATE,
  error: null as any,
  hasChanges: false,
  autoManualMode: false,
  pendingTransform: false,
};

export type FileStates = typeof initialStates;

const getErrorMessage = (error: any) => {
  if (error?.mark?.snippet) return error.mark.snippet;
  if (error?.message) return error.message;
  return "Invalid JSON format";
};

const syncJsonGraph = async (contents: string) => {
  const json = await contentToJson(contents);
  useJson.getState().setJson(JSON.stringify(json, null, 2));
};

const debouncedSyncJsonGraph = debounce(
  async (
    contents: string,
    onSuccess: () => void,
    onError: (error: any) => void,
  ) => {
    try {
      await syncJsonGraph(contents);
      onSuccess();
    } catch (error: any) {
      onError(error);
    }
  },
  TRANSFORM_DEBOUNCE_MS,
);

export const useApp = create<FileStates & JsonActions>()((set, get) => ({
  ...initialStates,
  clear: () => {
    debouncedSyncJsonGraph.cancel();
    set({
      contents: "",
      autoManualMode: false,
      pendingTransform: false,
    });
    useJson.getState().clear();
  },
  applyPendingTransform: async () => {
    try {
      const nextContents = get().contents;
      debouncedSyncJsonGraph.cancel();
      set({ error: null, pendingTransform: true });

      await syncJsonGraph(nextContents);
      set({ pendingTransform: false });
    } catch (error: any) {
      set({ error: getErrorMessage(error), pendingTransform: true });
    }
  },
  getContents: () => get().contents,
  getHasChanges: () => get().hasChanges,
  setContents: async ({ contents, hasChanges = true, skipUpdate = false }) => {
    const hasContentsUpdate = contents !== undefined;
    const nextContents = hasContentsUpdate ? contents : get().contents;
    const isLargeJson = nextContents.length >= LARGE_JSON_AUTO_MANUAL_THRESHOLD;
    const liveTransform = useStored.getState().liveTransform;
    const shouldUseManualMode = skipUpdate && (isLargeJson || !liveTransform);

    set({
      ...(hasContentsUpdate ? { contents: nextContents } : {}),
      error: null,
      hasChanges,
      autoManualMode: isLargeJson,
      pendingTransform: skipUpdate ? true : false,
    });

    if (shouldUseManualMode) {
      debouncedSyncJsonGraph.cancel();
      return;
    }

    if (!skipUpdate) {
      try {
        debouncedSyncJsonGraph.cancel();
        await syncJsonGraph(nextContents);
        set({ pendingTransform: false });
      } catch (error: any) {
        set({
          error: getErrorMessage(error),
          pendingTransform: true,
        });
      }
      return;
    }

    debouncedSyncJsonGraph(
      nextContents,
      () => set({ pendingTransform: false }),
      (error: any) =>
        set({
          error: getErrorMessage(error),
          pendingTransform: true,
        }),
    );
  },
  setError: (error) => set({ error }),
  setHasChanges: (hasChanges) => set({ hasChanges }),
}));
