import { z } from "zod"

export const changelogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  version: z.string().min(1, "Version is required"),
  category: z.enum(["FIX", "SECURITY", "FEATURE", "IMPROVEMENT"], {
    errorMap: () => ({ message: "Invalid category" }),
  }),
  status: z.enum(["DRAFT", "LIVE"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  body: z.string().min(1, "Content is required"),
})

export type ChangelogFormData = z.infer<typeof changelogSchema>
