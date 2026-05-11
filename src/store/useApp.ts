import { create } from "zustand";
import debounce from "lodash.debounce";
import { contentToJson } from "@/core/json/jsonAdapter";
import { getJsonStats, JsonStats } from "@/core/json/getJsonStats";
import { inferJsonSchema } from "@/core/json/inferSchema";
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
  toggleSchemaMode: () => Promise<void>;
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
  stats: null as JsonStats | null,
  schemaMode: false,
  schemaSource: "",
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
  return json;
};

const debouncedSyncJsonGraph = debounce(
  async (
    contents: string,
    onSuccess: (json: unknown) => void,
    onError: (error: any) => void,
  ) => {
    try {
      const json = await syncJsonGraph(contents);
      onSuccess(json);
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
      stats: null,
      schemaMode: false,
      schemaSource: "",
    });
    useJson.getState().clear();
  },
  applyPendingTransform: async () => {
    try {
      const nextContents = get().contents;
      debouncedSyncJsonGraph.cancel();
      set({ error: null, pendingTransform: true });

      const json = await syncJsonGraph(nextContents);
      set({ pendingTransform: false, stats: getJsonStats(json) });
    } catch (error: any) {
      set({ error: getErrorMessage(error), pendingTransform: true });
    }
  },
  toggleSchemaMode: async () => {
    if (get().schemaMode) {
      const sourceContents = get().schemaSource;
      set({ schemaMode: false, schemaSource: "" });
      if (sourceContents) {
        await get().setContents({
          contents: sourceContents,
          hasChanges: true,
          skipUpdate: false,
        });
      }
      return;
    }

    try {
      const originalContents = get().contents;
      const json = await contentToJson(originalContents);
      const inferredSchema = inferJsonSchema(json);

      set({
        schemaMode: true,
        schemaSource: originalContents,
      });
      await get().setContents({
        contents: JSON.stringify(inferredSchema, null, 2),
        hasChanges: true,
        skipUpdate: false,
      });
    } catch (error: any) {
      set({
        error: getErrorMessage(error),
        schemaMode: false,
        schemaSource: "",
      });
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
        const json = await syncJsonGraph(nextContents);
        set({ pendingTransform: false, stats: getJsonStats(json) });
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
      (json) =>
        set({
          pendingTransform: false,
          stats: getJsonStats(json),
        }),
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
