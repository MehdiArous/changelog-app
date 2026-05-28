"use client"

import { useSidebarStore } from "@/app/store/sidebar"
import type { ReactNode } from "react"

export default function SidebarContentShift({ children }: { children: ReactNode }) {
  const isOpen = useSidebarStore(state => state.isOpen)

  return (
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? "ml-52" : "ml-0"}`}>
      {children}
    </div>
  )
}
