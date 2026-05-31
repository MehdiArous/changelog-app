"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useSidebarStore } from "@/app/store/sidebar"
import { PenLine, FileText, Layers, Sparkles, Wrench, TrendingUp, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Category } from "@/prisma/src/generated/prisma/enums"

// Dashboard sidebar content
function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Compose", icon: <PenLine size={15} /> },
    { href: "/dashboard/drafts", label: "Drafts", icon: <FileText size={15} /> },
  ]

  return (
    <div className="flex flex-col gap-1 p-3">
      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider px-3 mb-3 mt-3">
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

function ChangelogNav() {

  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category") || "all"
  // 1. Create a helper function to build the safe URL string
  const buildHref = (categoryId: string) => {
    // Pulls a fresh copy of all current URL parameters (?year=2026, etc.)
    const params = new URLSearchParams(searchParams.toString())

    if (categoryId === "all") {
      // If clicking "All", remove the category parameter cleanly from the URL
      params.delete("category")
    } else {
      // Otherwise, append or update the category parameter
      params.set("category", categoryId)
    }

    // Return the combined string (e.g., "?year=2026&category=features")
    // If the string is empty, default back to a clean fallback "?"
    const queryString = params.toString()
    return queryString ? `?${queryString}` : "?"
  }

  const filterItems = [
    { id: "all", label: "All Updates", icon: <Layers size={15} /> },
    { id: Category.FEATURE, label: "Features", icon: <Sparkles size={15} /> },
    { id: Category.FIX, label: "Fixes", icon: <Wrench size={15} /> },
    { id: Category.IMPROVEMENT, label: "Improvements", icon: <TrendingUp size={15} /> },
    { id: Category.SECURITY, label: "Security", icon: <ShieldCheck size={15} /> },
  ]

  return (
    <div className="flex flex-col gap-1 p-3">
      <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider px-3 mb-3 mt-3">
        Filter
      </p>

      {filterItems.map(item => {
        const isActive = activeCategory === item.id

        // Dynamic query building: "all" clears the query to keep the URL clean
        const href = buildHref(item.id)

        return (
          <Link
            key={item.id}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
              ${isActive
                ? "bg-neutral-700 text-white font-medium"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
          >
            {/* The icon gets a slightly brighter color accent if active */}
            <span className={isActive ? "text-white" : "text-neutral-500"}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        )
      })}
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
      {pathname.includes("/changelog") && <ChangelogNav />}
    </aside>
  )
}
