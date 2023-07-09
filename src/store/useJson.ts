import { create } from "zustand";
import { useTree } from "./useTree";

type JsonActions = {
  setJson: (json: string) => void;
  getJson: () => string;
  clear: () => void;
};

const initialState = {
  json: "",
  loading: true,
};

export type JsonState = typeof initialState;

export const useJson = create<JsonState & JsonActions>()((set, get) => ({
  ...initialState,
  getJson: () => get().json,
  setJson: (json) => {
    set({ json, loading: false });
    useTree.getState().setGraph(json);
  },
  clear: () => {
    set({ json: "", loading: false });
    useTree.getState().clearGraph();
  },
}));
