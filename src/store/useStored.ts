import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useTree } from "@/store/useTree";

const initialStates = {
  lightmode: false,
  hideCollapse: true,
  childrenCount: true,
  imagePreview: true,
  liveTransform: true,
};

export interface ConfigActions {
  setLightTheme: (theme: boolean) => void;
  toggleHideCollapse: (value: boolean) => void;
  toggleChildrenCount: (value: boolean) => void;
  toggleImagePreview: (value: boolean) => void;
  toggleLiveTransform: (value: boolean) => void;
}

export const useStored = create(
  persist<typeof initialStates & ConfigActions>(
    (set) => ({
      ...initialStates,
      toggleLiveTransform: (liveTransform) => set({ liveTransform }),
      setLightTheme: (value: boolean) =>
        set({
          lightmode: value,
        }),
      toggleHideCollapse: (value: boolean) => set({ hideCollapse: value }),
      toggleChildrenCount: (value: boolean) => set({ childrenCount: value }),
      toggleImagePreview: (value: boolean) => {
        set({ imagePreview: value });
        useTree.getState().setGraph();
      },
    }),
    {
      name: "config",
    },
  ),
);
