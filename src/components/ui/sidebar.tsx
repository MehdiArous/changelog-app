"use client"

import { usePathname } from "next/navigation"
import { useSidebarStore } from "@/app/store/sidebar"
import { PenLine, FileText } from "lucide-react"
import Link from "next/link"

// Dashboard sidebar content
function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard",        label: "Compose", icon: <PenLine size={15} /> },
    { href: "/dashboard/drafts", label: "Drafts",  icon: <FileText size={15} /> },
  ]

  return (
    <div className="flex flex-col gap-1 p-3">
      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider px-3 mb-2">
        Workspace
      </p>
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
            ${pathname === item.href
              ? "bg-neutral-700 text-white font-medium"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </div>
  )
}

// Changelog sidebar content (filters — we'll build later)
function ChangelogNav() {
  return (
    <div className="flex flex-col gap-1 p-3">
      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider px-3 mb-2">
        Filter
      </p>
      <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors w-full text-left">
        All
      </button>
      <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors w-full text-left">
        Features
      </button>
      <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors w-full text-left">
        Fixes
      </button>
      <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors w-full text-left">
        Improvements
      </button>
      <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors w-full text-left">
        Security
      </button>
    </div>
  )
}

export default function Sidebar() {
  const isOpen = useSidebarStore(state => state.isOpen)
  const pathname = usePathname()

  return (
    <aside
      className={`
        fixed left-0 top-20 h-[calc(100vh-5rem)] w-52 
        border-r border-neutral-700 bg-neutral-900
        overflow-y-auto
        transition-transform duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {pathname.startsWith("/dashboard") && <DashboardNav />}
      {pathname.startsWith("/changelog") && <ChangelogNav />}
    </aside>
  )
}
