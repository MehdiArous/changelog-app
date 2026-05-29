"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ChangelogForm from "@/components/ui/changelog-form"
import { useDraftsStore } from "@/app/store/drafts"

export default function DraftEditDialog() {
  const { dialogOpen, selectedDraft, closeDialog } = useDraftsStore()

  if (!selectedDraft) return null

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="w-[90vw] max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Draft</DialogTitle>
          <DialogDescription>
            Edit your draft and publish when ready.
          </DialogDescription>
        </DialogHeader>
        <ChangelogForm
          mode="edit"
          draft={selectedDraft}
        />
      </DialogContent>
    </Dialog>
  )
}
