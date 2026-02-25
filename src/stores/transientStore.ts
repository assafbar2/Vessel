import { create } from "zustand";

export type VesselMode = "permanent" | "transient";

interface TransientStoreState {
  mode: VesselMode;
  showNotice: boolean;
  noticeMode: VesselMode | null;
  ashActive: boolean;

  toggleMode: () => void;
  setMode: (mode: VesselMode) => void;
  setShowNotice: (show: boolean) => void;
  setNoticeMode: (mode: VesselMode | null) => void;
  setAshActive: (active: boolean) => void;
}

const useTransientStore = create<TransientStoreState>((set) => ({
  mode: "permanent",
  showNotice: false,
  noticeMode: null,
  ashActive: false,

  toggleMode: () =>
    set((state) => ({
      mode: state.mode === "permanent" ? "transient" : "permanent",
    })),
  setMode: (mode) => set({ mode }),
  setShowNotice: (show) => set({ showNotice: show }),
  setNoticeMode: (mode) => set({ noticeMode: mode }),
  setAshActive: (active) => set({ ashActive: active }),
}));

export default useTransientStore;
