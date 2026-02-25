import { create } from "zustand";
import {
  loadSessionList,
  loadSessionContent,
  deleteSession,
  type SessionMeta,
} from "../lib/ipc";

interface VaultStoreState {
  sessions: SessionMeta[];
  selectedSessionId: string | null;
  selectedContent: string | null;
  loading: boolean;

  fetchSessions: () => Promise<void>;
  selectSession: (id: string) => Promise<void>;
  clearSelection: () => void;
  removeSession: (id: string) => Promise<void>;
}

const useVaultStore = create<VaultStoreState>((set, get) => ({
  sessions: [],
  selectedSessionId: null,
  selectedContent: null,
  loading: false,

  fetchSessions: async () => {
    set({ loading: true });
    try {
      const sessions = await loadSessionList();
      set({ sessions, loading: false });
    } catch (err) {
      console.error("Failed to load sessions:", err);
      set({ loading: false });
    }
  },

  selectSession: async (id) => {
    set({ loading: true });
    try {
      const content = await loadSessionContent(id);
      set({ selectedSessionId: id, selectedContent: content, loading: false });
    } catch (err) {
      console.error("Failed to load session content:", err);
      set({ loading: false });
    }
  },

  clearSelection: () =>
    set({ selectedSessionId: null, selectedContent: null }),

  removeSession: async (id) => {
    try {
      await deleteSession(id);
      const { sessions, selectedSessionId } = get();
      const updated = sessions.filter((s) => s.id !== id);
      const patch: Partial<VaultStoreState> = { sessions: updated };
      if (selectedSessionId === id) {
        patch.selectedSessionId = null;
        patch.selectedContent = null;
      }
      set(patch as VaultStoreState);
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  },
}));

export default useVaultStore;
