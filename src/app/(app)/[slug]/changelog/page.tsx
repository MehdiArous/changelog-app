import prisma from "@/lib/prisma"
import { Accordion } from "@/components/ui/accordion"
import MonthAccordionGroup from "./month-accordion-group"
import YearPagination from "./year-pagination"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ year?: string; category?: string }>
}

export default async function ChangelogPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams

  const currentYear = new Date().getFullYear().toString()
  const activeYear = resolvedSearchParams.year || currentYear
  const activeCategory = resolvedSearchParams.category

  // get available years from db
  const workspace = await prisma.workSpace.findUnique({
    where: { slug },
    select: { id: true, name: true }
  })
  if (!workspace) return <div>Workspace not found</div>

  // 1. Get the boundary years in a single aggregate query
  const aggregations = await prisma.changeLog.aggregate({
    where: {
      status: "LIVE",
      workspaceId: workspace.id,
    },
    _min: { publishedAt: true },
    _max: { publishedAt: true },
  })

  
  const oldestDate = aggregations._min.publishedAt
  const newestDate = aggregations._max.publishedAt
  
  let availableYears: string[] = []
  
  if (oldestDate && newestDate) {
    const startYear = oldestDate.getFullYear()
    const endYear = newestDate.getFullYear()
    availableYears = Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => (endYear - index).toString()
    )
  }

  // if no years in db, fallback to current year
  if (!availableYears.includes(currentYear)) {
    availableYears.unshift(currentYear)
  }

  const changelogs = await prisma.changeLog.findMany({
    where: {
      status: "LIVE",
      workspaceId: workspace.id,
      publishedAt: {
        gte: new Date(`${activeYear}-01-01`),
        lte: new Date(`${activeYear}-12-31T23:59:59.999Z`),
      },
      ...(activeCategory && activeCategory !== "all"
        ? { category: activeCategory as any }
        : {}),
    },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      category: true,
      publishedAt: true,
    }
  })

  // group by month using publishedAt
  const groupedLogs = changelogs.reduce((acc, log) => {
    const monthYear = log.publishedAt!.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    if (!acc[monthYear]) acc[monthYear] = []
    acc[monthYear].push(log)
    return acc
  }, {} as Record<string, typeof changelogs>)

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">

      {/* Header */}
      {/* <div className="mb-10">
        <h1 className="text-3xl font-bold text-neutral-100 tracking-tight">
          {workspace.name}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Product updates and improvements
        </p>
      </div> */}


      {/* Month groups */}
      {Object.keys(groupedLogs).length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-800 rounded-xl">
          <p className="text-neutral-500 text-sm">
            No updates for {activeYear}.
          </p>
        </div>
      ) : (
        <Accordion
          type="multiple"
          className="w-full"
        >
          {Object.entries(groupedLogs).map(([monthName, logs]) => (
            <MonthAccordionGroup
              key={monthName}
              monthName={monthName}
              logs={logs}
              slug={slug}
            />
          ))}
        </Accordion>
      )}
      <YearPagination
        availableYears={availableYears}
        activeYear={activeYear}
      />
    </div>
  )
}
