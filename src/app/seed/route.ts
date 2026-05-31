import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Category } from "@/prisma/src/generated/prisma/enums"

export async function GET() {
  try {
    const TARGET_WORKSPACE_ID = "cmpixkj9q0000pgujc1ezrt3m"

    // 1. Double check the workspace actually exists to prevent foreign key constraint crashes
    const workspaceExists = await prisma.workSpace.findUnique({
      where: { id: TARGET_WORKSPACE_ID }
    })

    if (!workspaceExists) {
      return NextResponse.json(
        { error: `Workspace with ID "${TARGET_WORKSPACE_ID}" not found. Please create it first.` },
        { status: 400 }
      )
    }

    // 2. High-quality mock data matrix split logically by category
    const pool = {
      [Category.FEATURE] : [
        { title: "v2.1.0 — Real-time Collaboration Engine", body: "We are incredibly excited to launch our fully managed multiplayer canvas environment. Teams can now simultaneously refactor nodes, edit rich text blocks, and view cursor positions with a sub-50ms synchronization footprint." },
        { title: "v1.8.0 — Advanced Analytics Dashboards", body: "Gain deep visibility into your customer success flows. The new metrics terminal aggregates workspace throughput, daily active sessions, and multi-tenant billing thresholds into customizable dashboard widgets." },
        { title: "v1.4.0 — Native Slack & Discord Integrations", body: "Connect your core workflows directly to your communication layers. You can now configure fine-grained webhook automation schemas to alert engineering blocks whenever draft body switches to production-ready states." }
      ],
      [Category.FIX]: [
        { title: "Hotfix — Memory Leak in Virtualized Grid", body: "Resolved a critical layout degradation vector where mounting deep recursive array nodes under heavy window scroll states failed to release event listener footprints cleanly. Garbage collection thresholds are back to baseline." },
        { title: "Patch — Re-auth Loop on Token Expiration", body: "Fixed an edge case where middleware intercepting dynamic session token refreshes dropped localized headers during concurrent backend API router roundtrips." }
      ],
      [Category.IMPROVEMENT]: [
        { title: "Performance Update — 4x Faster Prisma Query Cold-Starts", body: "Optimized relational database fetch layers by implementing structural selective joins on database indexing properties. View response delays collapsed from 340ms straight down to 45ms safely." },
        { title: "UI Refresh — Unified Sidebar Layout Mechanics", body: "Refactored the core workspace navigation layouts to leverage strict modern CSS nesting properties. Fixed active focus rings, layout element shifting, and improved transition fluidity on lower refresh-rate screens." }
      ],
      [Category.SECURITY]: [
        { title: "Security Advisory — Implemented Row-Level Encrypted Keys", body: "In alignment with enterprise infrastructure standards, all sensitive webhook keys and environment authorization string blocks are now encrypted symmetrically using hardware-accelerated AES-256-GCM pipelines before saving to disk." },
        { title: "Infrastructure — Mandatory MFA Sessions and Token Revocation", body: "Upgraded our core authentication engine layout to support strict timed multi-factor sessions. Active browser footprints can now be force-invalidated globally directly from your workspace dashboard security page." }
      ]
    }

    // 3. Define the precise timeline window requested (May 2026 down to April 2023)
    // We walk month-by-month to guarantee a balanced timeline curve across your accordion layout
    const startPeriod = new Date("2026-05-15T12:00:00")
    const endPeriod = new Date("2021-04-15T12:00:00")
    
    const seedPayloads: any[] = []
    let currentIterationDate = new Date(startPeriod)

    // Generate ~45 distinct logs tracking historically backwards
    while (currentIterationDate >= endPeriod) {
      // Pick a random category type safely
      const categories = Object.keys(pool) as Category[]
      const chosenCategory = categories[Math.floor(Math.random() * categories.length)]
      
      // Select a random title/body set matching that category
      const dataset = pool[chosenCategory]
      const element = dataset[Math.floor(Math.random() * dataset.length)]

      // Handle the strict 80/20 Live-to-Draft distribution quota requested
      const status = Math.random() > 0.20 ? "LIVE" : "DRAFT"

      // Lock a specific timestamp copy for this entry
      const logDate = new Date(currentIterationDate)

      seedPayloads.push({
        workspaceId: TARGET_WORKSPACE_ID,
        title: element.title,
        body: element.body,
        category: chosenCategory,
        status: status,
        createdAt: logDate,
        // Match publishedAt to createdAt exactly for LIVE, set to null for DRAFTS
        publishedAt: status === "LIVE" ? logDate : null,
      })

      // Shift the timeline backwards by 20 to 25 days to simulate natural product ship cycles
      const dayOffset = 20 + Math.floor(Math.random() * 5)
      currentIterationDate.setDate(currentIterationDate.getDate() - dayOffset)
    }

    // 4. Wipe out any older mock test entries to allow safe, clean retries
    await prisma.changeLog.deleteMany({
      where: { workspaceId: TARGET_WORKSPACE_ID }
    })

    // 5. Bulk insert payload array via Prisma Transaction batch execution
    await prisma.$transaction(
      seedPayloads.map(payload => prisma.changeLog.create({ data: payload }))
    )

    return NextResponse.json({
      success: true,
      message: `Database successfully seeded for workspace ${TARGET_WORKSPACE_ID}`,
      totalRecordsInserted: seedPayloads.length,
      distribution: {
        live: seedPayloads.filter(p => p.status === "LIVE").length,
        draft: seedPayloads.filter(p => p.status === "DRAFT").length,
      }
    })

  } catch (error: any) {
    console.error("SEEDING_ERROR:", error)
    return NextResponse.json(
      { error: "Internal Seeding Failure", details: error.message },
      { status: 500 }
    )
  }
}
