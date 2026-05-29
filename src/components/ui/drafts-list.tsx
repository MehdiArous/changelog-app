"use client"

import { useEffect, useTransition } from "react"
import { formatDistanceToNow } from "date-fns"
import { Trash2, Loader2, Pencil, FileQuestion, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { loadMoreDrafts, deleteDraft } from "@/app/actions/changelog"
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DraftEditDialog from "@/lib/draft-edit-dialog"
import { useDraftsStore } from "@/app/store/drafts"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog"

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

const CATEGORY_STYLES: Record<string, string> = {
  FEATURE:     "bg-blue-500/10 text-blue-400",
  FIX:         "bg-red-500/10 text-red-400",
  IMPROVEMENT: "bg-green-500/10 text-green-400",
  SECURITY:    "bg-amber-500/10 text-amber-400",
}

export default function DraftsList({
  initialDrafts,
  totalDrafts,
  workspaceId,
}: {
  initialDrafts: Draft[]
  totalDrafts:   number
  workspaceId:   string
}) {
  const [isPending, startTransition] = useTransition()

  const {
    drafts, total,
    setInitial, removeDraft, appendDrafts,
    openDialog, dialogOpen
  } = useDraftsStore()

  // hydrate store with server data
  useEffect(() => {
    setInitial(initialDrafts, totalDrafts)
  }, [])

  const hasMore = drafts.length < total
  const router = useRouter();

  function handleLoadMore() {
    startTransition(async () => {
      const newDrafts = await loadMoreDrafts(workspaceId, drafts.length)
      appendDrafts(newDrafts as Draft[])
    })
  }

  function handleDelete(id: string) {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        startTransition(async () => {
          const result = await deleteDraft(id)
          if (result.success) {
            removeDraft(id)
            resolve()
          } else {
            reject(new Error(result.error ?? "Failed to delete"))
          }
        })
      }),
      {
        loading: "Deleting...",
        success: "Draft deleted",
        error:   (err) => err.message,
      }
    )
  }

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        {/* Animated Glow effect behind the icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-neutral-800 blur-xl rounded-full opacity-50 animate-pulse" />
          <div className="relative bg-neutral-900 border border-neutral-800 p-5 rounded-2xl text-neutral-400">
            <FileQuestion className="w-12 h-12 stroke-[1.5]" />
          </div>
          {/* Floating Emoji */}
          <span className="absolute -bottom-2 -right-2 text-3xl animate-bounce [animation-duration:3s]">
            👻
          </span>
        </div>

        {/* Text Details */}
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight mb-2">
          Oops! Drafts not found
        </h1>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">
        Drafts — {total}
      </h2>

      <div className="border border-neutral-800 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="text-neutral-500 w-[150px]">Category</TableHead>
              <TableHead className="text-neutral-500">Title</TableHead>
              <TableHead className="text-neutral-500 w-[150px]">Version</TableHead>
              <TableHead className="text-neutral-500 w-[200px]">Date</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drafts.map(draft => (
              <TableRow
                key={draft.id}
                className="border-neutral-800 hover:bg-neutral-800/50 cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/dashboard/drafts/${draft.id}`)
                }}
              >
                {/* Category */}
                <TableCell>
                  <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${CATEGORY_STYLES[draft.category]}`}>
                    {draft.category.charAt(0) + draft.category.slice(1).toLowerCase()}
                  </span>
                </TableCell>

                {/* Title + body preview */}
                <TableCell>
                  <p className="text-lg text-neutral-200 font-medium truncate max-w-[400px]">
                    {draft.title}
                    <span className="text-base text-neutral-500 truncate max-w-[400px] mt-0.5 px-1">
                      - {draft.body.replace(/<[^>]*>/g, " ").slice(0, 60)}
                    </span>
                  </p>
                </TableCell>

                {/* Version */}
                <TableCell>
                  <span className="text-base text-neutral-500 font-mono">
                    {draft.version ?? "—"}
                  </span>
                </TableCell>

                {/* Date */}
                <TableCell>
                  <span className="text-base text-neutral-500">
                    {formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true })}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={e => { e.stopPropagation(); openDialog(draft) }}
                          className="p-1.5 rounded-md text-neutral-500 hover:text-blue-400 hover:bg-neutral-700 transition-colors cursor-pointer"
                        >
                          <Pencil size={16} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>Edit</p>
                      </TooltipContent>
                    </Tooltip>
                    <div onClick={e => e.stopPropagation()}>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="p-1.5 rounded-md text-neutral-500 hover:text-red-400 hover:bg-neutral-700 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex flex-row items-center gap-3 mb-4 text-xl"> <AlertTriangle color="red"/> Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-base">
                              This action cannot be undone. This will permanently delete this draft.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(draft.id)}
                              className="bg-red-600 text-white hover:bg-red-700 font-medium cursor-pointer"
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            onClick={handleLoadMore}
            disabled={isPending}
            className="text-neutral-400 hover:text-white text-sm cursor-pointer"
          >
            {isPending
              ? <><Loader2 size={14} className="animate-spin mr-2" />Loading...</>
              : `Show more (${total - drafts.length} remaining)`
            }
          </Button>
        </div>
      )}

      {dialogOpen && <DraftEditDialog />}
    </div>
  )
}
