"use client"

import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react"
import Link from "next/link"

interface YearPaginationProps {
  availableYears: string[]
  activeYear: string
}

export default function YearPagination({ availableYears, activeYear }: YearPaginationProps) {
  const searchParams = useSearchParams()
  const currentIndex = availableYears.indexOf(activeYear)

  const buildHref = (year: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("year", year)
    return `?${params.toString()}`
  }

  const getVisibleYears = (): (string | "...")[] => {
    const total = availableYears.length
    if (total <= 5) return availableYears

    const result: (string | "...")[] = []
    const first = availableYears[0]
    const last = availableYears[total - 1]
    const prev = availableYears[currentIndex - 1]
    const next = availableYears[currentIndex + 1]

    // always show first
    result.push(first)

    // ellipsis if active is far from start
    if (currentIndex > 2) result.push("...")

    // show prev only if it's not first and not already added
    if (prev && prev !== first) result.push(prev)

    // show active only if it's not already added (not first)
    if (activeYear !== first) result.push(activeYear)

    // show next only if it's not last
    if (next && next !== last) result.push(next)

    // ellipsis if active is far from end
    if (currentIndex < total - 3) result.push("...")

    // always show last only if not already added
    if (last !== activeYear) result.push(last)

    return result
  }

  const visibleYears = getVisibleYears()
  const hasNext = currentIndex < availableYears.length - 1
  const hasPrev = currentIndex > 0

  return (
    <div className="flex items-center justify-between mt-16 pt-6 border-t border-neutral-800">

      {/* Previous */}
      {hasPrev ? (

        <Link href={buildHref(availableYears[currentIndex - 1])}
          className="flex items-center gap-1.5 text-sm font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
        >
          <ChevronLeft size={16} />
          Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1.5 text-sm font-bold text-neutral-700 cursor-not-allowed uppercase tracking-wider">
          <ChevronLeft size={16} />
          Prev
        </span>
      )}

      {/* Year links */}
      <div className="flex items-center gap-2">
        {visibleYears.map((year, i) =>
          year === "..." ? (
            <span key={`ellipsis-${i}`}>
              <Ellipsis size={20} className="stroke-[2.5]" />
            </span>
          ) : (

            <Link key={year}
              href={buildHref(year)}
              className={`
                px-3 py-1 rounded-md text-sm font-bold transition-all
                ${year === activeYear
                  ? "border border-neutral-600 text-white"
                  : "text-neutral-500 hover:text-white"
                }
              `}
            >
              {year}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      {hasNext ? (

        <Link href={buildHref(availableYears[currentIndex + 1])}
          className="flex items-center gap-1.5 text-sm font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
        >
          Next
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="flex items-center gap-1.5 text-sm font-bold text-neutral-700 cursor-not-allowed uppercase tracking-wider">
          Next
          <ChevronRight size={16} />
        </span>
      )}

    </div>
  )
}
