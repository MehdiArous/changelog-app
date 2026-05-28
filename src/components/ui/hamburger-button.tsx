"use client"

import { useSidebarStore } from "@/app/store/sidebar"
import { Menu } from "lucide-react"

export default function HamburgerButton() {
  const toggle = useSidebarStore(state => state.toggle)

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md cursor-pointer text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
      aria-label="Toggle sidebar"
    >
      <Menu size={20} />
    </button>
  )
}
