import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import DraftsList from "@/components/ui/drafts-list"

export default async function DraftsPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  const workspace = await prisma.workSpace.findUnique({
    where: { userId: session.user.id },
  })
  if (!workspace) redirect("/")

  const [drafts, totalDrafts] = await Promise.all([
    prisma.changeLog.findMany({
      where: { workspaceId: workspace.id, status: "DRAFT" },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.changeLog.count({
      where: { workspaceId: workspace.id, status: "DRAFT" },
    }),
  ])

  return (
    <DraftsList
      initialDrafts={drafts}
      totalDrafts={totalDrafts}
      workspaceId={workspace.id}
    />
  )
}
