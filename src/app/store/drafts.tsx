import { create } from "zustand"

type Draft = {
  id:          string
  title:       string
  body:        string
  version:     string | null
  category:    string
  status:      string
  createdAt:   Date
  publishedAt: Date | null
}

type DraftsStore = {
  drafts:      Draft[]
  total:       number
  dialogOpen:  boolean
  selectedDraft: Draft | null

  // actions
  setInitial:     (drafts: Draft[], total: number) => void
  updateDraft:    (updated: Draft) => void
  removeDraft:    (id: string) => void
  appendDrafts:   (newDrafts: Draft[]) => void
  openDialog:     (draft: Draft) => void
  closeDialog:    () => void
}

export const useDraftsStore = create<DraftsStore>((set) => ({
  drafts:        [],
  total:         0,
  dialogOpen:    false,
  selectedDraft: null,

  setInitial: (drafts, total) => set({ drafts, total }),

  updateDraft: (updated) => set(state => ({
    // if published → remove from drafts list
    drafts: updated.status === "LIVE"
      ? state.drafts.filter(d => d.id !== updated.id)
      : state.drafts.map(d => d.id === updated.id ? updated : d),
    total: updated.status === "LIVE"
      ? state.total - 1
      : state.total,
  })),

  removeDraft: (id) => set(state => ({
    drafts: state.drafts.filter(d => d.id !== id),
    total:  state.total - 1,
  })),

  appendDrafts: (newDrafts) => set(state => ({
    drafts: [...state.drafts, ...newDrafts],
  })),

  openDialog:  (draft) => set({ dialogOpen: true,  selectedDraft: draft }),
  closeDialog: ()      => set({ dialogOpen: false, selectedDraft: null  }),
}))
