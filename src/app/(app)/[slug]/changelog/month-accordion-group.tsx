"use client"

import Link from "next/link"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { ChevronRight } from "lucide-react"

// fixed: singular keys matching your enum
const categoryStyles: Record<string, string> = {
  FEATURE: "text-emerald-400 bg-emerald-950/30 border-emerald-900/40",
  FIX: "text-red-400 bg-red-950/30 border-red-900/40",
  IMPROVEMENT: "text-blue-400 bg-blue-950/30 border-blue-900/40",
  SECURITY: "text-amber-400 bg-amber-950/30 border-amber-900/40",
}

interface MonthAccordionGroupProps {
  monthName: string
  slug: string
  logs: Array<{
    id: string
    title: string
    category: string
    publishedAt: Date | null  // changed from createdAt
  }>
}

export default function MonthAccordionGroup({ monthName, logs, slug }: MonthAccordionGroupProps) {
  return (
    <AccordionItem
      value={monthName}
      className="border-b border-neutral-800/60 py-2"
    >
      <AccordionTrigger className="text-xl font-semibold tracking-tight text-neutral-400 hover:text-white py-4 cursor-pointer">
        {monthName}
      </AccordionTrigger>

      <AccordionContent className="pt-1 pb-4 space-y-2">
        {logs.map((log) => {
          const dateString = log.publishedAt
            ? new Date(log.publishedAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            }).replace(" ", ". ")
            : ""

          return (
            <Link
              key={log.id}
              href={`/${slug}/changelog/${log.id}`}
              // 1. Swapped to flex-col to stack rows, items-start to align content left
              className="!no-underline flex flex-col items-start gap-2 px-4 py-3.5 hover:bg-neutral-800 rounded-lg transition-all group"
            >
              {/* Top Row: Meta Information */}
              {/* 2. Added a wrapper container for date and badge to sit side-by-side */}
              <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                {/* Date String */}
                <span className="uppercase tracking-wider">
                  {dateString.replace(",", "")} {/* Cleans up 'May 29' format */}
                </span>

                {/* Category badge */}
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border shrink-0 ${categoryStyles[log.category] ?? "text-neutral-400 border-neutral-800"
                  }`}>
                  {log.category.toLowerCase()}
                </span>
              </div>

              {/* Bottom Row: Title and Interactive Indicator */}
              {/* 3. Put the title below the meta row, expanding full-width */}
              <div className="flex items-center justify-between w-full gap-4">
                {/* Title - Increased font size slightly to match image importance */}
                <h3 className="text-base font-semibold text-neutral-200 group-hover:text-white transition-colors truncate">
                  {log.title}
                </h3>

                {/* Chevron Right indicator remains on far right */}
                <ChevronRight
                  size={14}
                  className="text-neutral-600 group-hover:text-neutral-300 transition-colors shrink-0"
                />
              </div>
            </Link>
          )
        })}
      </AccordionContent>
    </AccordionItem>
  )
}
