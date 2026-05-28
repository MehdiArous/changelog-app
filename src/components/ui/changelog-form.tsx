"use client"

import { useRef, useState, useTransition } from "react"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Input } from "./input"
import TextEditor from "./text-editor"
import { Field, FieldLabel } from "./field"
import { NativeSelect, NativeSelectOption } from "./native-select"
import { Loader2, Send } from "lucide-react"
import { Category, Status } from "@/prisma/src/generated/prisma/enums"
import { ActionState, createChangelog } from "@/app/actions/changelog"
import { toast } from "sonner"

export default function ChangelogForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()

  // controlled inputs — keeps values on failed submit
  const [title, setTitle] = useState("")
  const [version, setVersion] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")
  const [resetKey, setResetKey] = useState(0)
  const bodyRef = useRef("")

  // field errors — manual now
  const [fieldErrors, setFieldErrors] = useState<ActionState["fieldErrors"]>({})

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData()
    formData.set("title", title)
    formData.set("version", version)
    formData.set("category", category)
    formData.set("status", status)
    formData.set("body", bodyRef.current)
    
    // clear previous errors
    setFieldErrors({})

    const promise = new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        const result = await createChangelog(formData)

        if (result.success) {
          // reset everything
          setTitle("")
          setVersion("")
          setCategory("")
          setStatus("")
          setResetKey(prev => 1 + prev)
          setFieldErrors({})
          resolve()
        } else if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors)
          reject(new Error("Please fix the errors below."))
        } else {
          reject(new Error(result.error ?? "Something went wrong."))
        }
      })
    })

    toast.promise(promise, {
      loading: "Publishing...",
      success: "Changelog published!",
      error: (err) => err.message,
    })
  }

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-lg">New changelog entry</CardTitle>
        <CardAction>
          <Button type="submit" disabled={isPending} form="changelog-form" className="flex items-center gap-2 cursor-pointer">
          {isPending 
            ? <Loader2 size={14} className="animate-spin" /> 
            : <Send size={14} />
          }
          Publish
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form ref={formRef} id="changelog-form" onSubmit={handleSubmit}>
          <div className="w-full">
            <div className="flex align-center justify-between gap-6">
              <Field>
                <FieldLabel htmlFor="title" className={fieldErrors?.title ? "text-red-500" : ''}>Title</FieldLabel>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Improved dashboard performance"
                  autoComplete="off"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={fieldErrors?.title
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""}
                />
                {fieldErrors?.title && (
                  <p className="px-2 text-red-500 mt-1">
                    {fieldErrors.title[0]}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="version" className={fieldErrors?.version ? "text-red-500" : ''}>Version</FieldLabel>
                <Input
                  id="version"
                  name="version"
                  placeholder="v2.4.1"
                  value={version}
                  autoComplete="off"
                  onChange={e => setVersion(e.target.value)}
                  className={fieldErrors?.version
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""}
                />
                {fieldErrors?.version && (
                  <p className="px-2 text-red-500 mt-1">
                    {fieldErrors.version[0]}
                  </p>
                )}
              </Field>
            </div>
            <div className="flex align-center justify-between gap-6 mt-4">
              <Field>
                <FieldLabel htmlFor="category" className={fieldErrors?.category ? "text-red-500" : ''}>Category</FieldLabel>
                <NativeSelect 
                  name="category" 
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className={fieldErrors?.category
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""}
                  >
                  <NativeSelectOption value="">Select Category</NativeSelectOption>
                  {Object.entries(Category).map(([value, label]) => (
                    <NativeSelectOption key={value} value={value}>
                      {label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {fieldErrors?.category && (
                  <p className="px-2 text-red-500 mt-1">
                    {fieldErrors.category[0]}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="status" className={fieldErrors?.status ? "text-red-500" : ''}>Status</FieldLabel>
                <NativeSelect 
                  name="status" 
                  id="status"                   
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className={fieldErrors?.status
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""}
                >
                  <NativeSelectOption value="">Select Status</NativeSelectOption>
                  {Object.entries(Status).map(([value, label]) => (
                    <NativeSelectOption key={value} value={value}>
                      {label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                {fieldErrors?.status && (
                  <p className="px-2 text-red-500 mt-1">
                    {fieldErrors.status[0]}
                  </p>
                )}
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="content" className={`mt-4 ${fieldErrors?.body ? "text-red-500" : ""}`}>Content</FieldLabel>
              <div className={fieldErrors?.body ? "rounded-lg border border-red-500" : ""}>
                <TextEditor onChange={(html) => { bodyRef.current = html }}  resetKey={resetKey}/>
              </div>  
              {fieldErrors?.body && (
                <p className="px-2 text-red-500">{fieldErrors.body[0]}</p>
              )}
            </Field>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
