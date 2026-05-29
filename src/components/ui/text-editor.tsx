"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic, Heading2, List, Code } from "lucide-react"
import { useEffect, useState } from "react"
import { Placeholder } from "@tiptap/extension-placeholder"
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'

type Props = {
  onChange?: (html: string) => void
  resetKey?: number
  initialContent?: string
}


const TextEditor = ({ resetKey, onChange, initialContent }: Props) => {
  // Initialize lowlight with common languages (Python, JS, HTML, etc.)
  const lowlight = createLowlight(common)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
            // Disable default code block so lowlight can take over
            codeBlock: false, 
          }),
          CodeBlockLowlight.configure({
            lowlight,
          }),
      Placeholder.configure({
        placeholder: "Write your changelog content here…",
      }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: [
          "min-h-40 w-full bg-neutral-900 px-4 py-3",
          "text-lg text-neutral-200 focus:outline-none leading-relaxed",
          // bullet list styles
          "[&_ul]:list-disc [&_ul]:ml-4 [&_ul]:space-y-1",
          // h2 styles
          "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-neutral-100 [&_h2]:mb-2",
          // inline code styles
          "[&_code]:bg-neutral-700 [&_code]:text-purple-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono",
          // Code Block Container Styles
          "[&_pre]:bg-neutral-800 [&_pre]:border [&_pre]:border-neutral-800 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-4 [&_pre]:font-mono [&_pre]:text-sm",
          
          // Dynamic VS Code Colors for Lowlight tokens inside the editor workspace
          "[&_.hljs-keyword]:text-[#569CD6]",     // def, if, return
          "[&_.hljs-string]:text-[#CE9178]",      // "Strings"
          "[&_.hljs-title.hljs-function]:text-[#DCDCAA]", // functionName()
          "[&_.hljs-comment]:text-[#6A9955] [&_.hljs-comment]:italic", // # Comments
          "[&_.hljs-number]:text-[#B5CEA8]",       // Numbers
          "[&_.hljs-params]:text-[#9CDCFE]",       // Parameters
          "[&_pre_code]:text-[#9CDCFE] [&_pre_code]:bg-transparent [&_pre_code]:p-0", // Default variable color
        ].join(" "),
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
    },
  })

  useEffect(() => {
    if (resetKey && editor) {
      editor.commands.clearContent()
    }
  }, [resetKey])

  useEffect(() => {
    if (!editor) return
    if (!initialContent) return
    if (editor.getHTML() === initialContent) return
    editor.commands.setContent(initialContent)
  }, [editor, initialContent])

  const toolbarButtons = [
    {
      icon: <Bold size={14} />,
      action: () => editor?.chain().focus().toggleBold().run(),
      isActive: editor?.isActive("bold"),
      label: "Bold",
    },
    {
      icon: <Italic size={14} />,
      action: () => editor?.chain().focus().toggleItalic().run(),
      isActive: editor?.isActive("italic"),
      label: "Italic",
    },
    {
      icon: <Heading2 size={14} />,
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor?.isActive("heading", { level: 2 }),
      label: "Heading 2",
    },
    {
      icon: <List size={14} />,
      action: () => editor?.chain().focus().toggleBulletList().run(),
      isActive: editor?.isActive("bulletList"),
      label: "Bullet list",
    },
    {
      icon: <Code size={14} />,
      action: () => editor?.chain().focus().toggleCodeBlock().run(),
      isActive: editor?.isActive("codeBlock"),
      label: "Code block",
    },
  ]

  const [, forceUpdate] = useState(0)

  useEffect(() => {
    if (!editor) return
    editor.on("transaction", () => forceUpdate(n => 1 - n))
    return () => { editor.off("transaction") }
  }, [editor])

  const btnClass = (active: boolean | undefined) =>
    `p-2 rounded-md transition-colors
     ${active
       ? "bg-neutral-600 text-white"
       : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700"
     }`

  if (!editor) return null

  return (
    <div className="rounded-lg border border-neutral-700 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 bg-neutral-800 border-b border-neutral-700">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            className={btnClass(btn.isActive)}
            aria-label={btn.label}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}

export default TextEditor
