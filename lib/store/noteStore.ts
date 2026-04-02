import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteDraft } from '@/types/note';

export const initialDraft: NoteDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteStoreState {
  draft: NoteDraft;
  setDraft: (note: NoteDraft) => void;
  clearDraft: () => void;
}

export const useNoteDraftStore = create<NoteStoreState>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: note => set({ draft: note }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'notehub-draft',
    }
  )
);
