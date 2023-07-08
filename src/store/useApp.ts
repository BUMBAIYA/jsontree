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
  setError: (error: object | null | string) => void;
  setHasChanges: (hasChanges: boolean) => void;
  setContents: (data: SetContents) => void;
  clear: () => void;
}

export type File = {
  _id: string;
  name: string;
  json: string;
  private: boolean;
  createdAt: string;
  updatedAt: string;
};

const initialStates = {
  fileData: null as File | null,
  contents: JSON_TEMPLATE,
  error: null as any,
  hasChanges: false,
  jsonSchema: null as object | null,
};

export type FileStates = typeof initialStates;

const debouncedUpdateJson = debounce(
  (value: unknown) =>
    useJson.getState().setJson(JSON.stringify(value, null, 2)),
  800,
);

export const useApp = create<FileStates & JsonActions>()((set, get) => ({
  ...initialStates,
  clear: () => {
    set({ contents: "" });
    useJson.getState().clear();
  },
  getContents: () => get().contents,
  getHasChanges: () => get().hasChanges,
  setContents: async ({ contents, hasChanges = true, skipUpdate = false }) => {
    try {
      set({ ...(contents && { contents }), error: null, hasChanges });
      const json = await contentToJson(get().contents);
      if (!useStored.getState().liveTransform && skipUpdate) return;

      debouncedUpdateJson(json);
    } catch (error: any) {
      if (error?.mark?.snippet) return set({ error: error.mark.snippet });
      if (error?.message) set({ error: error.message });
    }
  },
  setError: (error) => set({ error }),
  setHasChanges: (hasChanges) => set({ hasChanges }),
}));
