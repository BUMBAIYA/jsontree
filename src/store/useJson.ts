import { create } from "zustand";

type JsonActions = {
  setJson: (json: string) => void;
  getJson: () => string;
  setError: (error: object | null | string) => void;
  clear: () => void;
};

const initialState = {
  json: "",
  error: null as any,
  loading: false,
};

export type JsonState = typeof initialState;

export const useJson = create<JsonState & JsonActions>()((set, get) => ({
  ...initialState,
  getJson: () => get().json,
  setJson: (json) => {
    set({ json, loading: false });
  },
  setError: (error) => set({ error }),
  clear: () => {
    set({ json: "", loading: false });
  },
}));
