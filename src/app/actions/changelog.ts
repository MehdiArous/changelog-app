"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { changelogSchema } from "@/lib/validations/changelog"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type ActionState = {
  success: boolean
  error: string | null
  fieldErrors?: Record<string, string[]>
}

export async function createChangelog(
  formData: FormData
): Promise<ActionState> {
  const session = await auth()
  if (!session?.user) redirect("/")

  const workspace = await prisma.workSpace.findUnique({
    where: { userId: session.user.id },
  })
  if (!workspace) return { success: false, error: "Workspace not found" }

  // parse raw values
  const raw = {
    title:    formData.get("title") as string,
    version:  formData.get("version") as string,
    category: formData.get("category") as string,
    status:   formData.get("status") as string,
    body:     formData.get("body") as string,
  }

  // validate body is not just empty HTML
  const strippedBody = raw.body?.replace(/<[^>]*>/g, "").trim()

  // zod validation
  const result = changelogSchema.safeParse({
    ...raw,
    body: strippedBody,
  });
  
  if (!result.success) {
    return {
      success: false,
      error: null,
      fieldErrors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  await new Promise(resolve => setTimeout(resolve, 2000))
  // save to db
  try {
    await prisma.changeLog.create({
      data: {
        title:       result.data.title,
        version:     result.data.version ?? null,
        category:    result.data.category,
        status:      result.data.status,
        body:        raw.body,
        publishedAt: result.data.status === "LIVE" ? new Date() : null,
        workspaceId: workspace.id,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, error: null }
  } catch (e) {
    return { success: false, error: "Something went wrong. Please try again." }
  }
}
