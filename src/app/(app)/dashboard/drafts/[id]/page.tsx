import React from 'react';
import { ChevronLeft, Calendar, MoveLeft, FileQuestion } from "lucide-react";
import Link from "next/link";
import { getDraft } from '@/app/actions/changelog';
import ChangelogHighlighter from '@/lib/changelog-highlighter';

const CATEGORY_STYLES: Record<string, string> = {
  FEATURE:     "bg-blue-500/10 text-blue-400",
  FIX:         "bg-red-500/10 text-red-400",
  IMPROVEMENT: "bg-green-500/10 text-green-400",
  SECURITY:    "bg-amber-500/10 text-amber-400",
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DraftDetailPage({ params }: PageProps) {
  const { id } = await params;
  const draft = await getDraft(id);

// --- NICE LOOKING NOT FOUND STATE ---
  if (!draft) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        {/* Animated Glow effect behind the icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-neutral-800 blur-xl rounded-full opacity-50 animate-pulse" />
          <div className="relative bg-neutral-900 border border-neutral-800 p-5 rounded-2xl text-neutral-400">
            <FileQuestion className="w-12 h-12 stroke-[1.5]" />
          </div>
          {/* Floating Emoji */}
          <span className="absolute -bottom-2 -right-2 text-3xl animate-bounce [animation-duration:3s]">
            👻
          </span>
        </div>

        {/* Text Details */}
        <h1 className="text-2xl font-bold text-neutral-100 tracking-tight mb-2">
          Oops! Draft not found
        </h1>
        <p className="text-sm text-neutral-400 max-w-sm mb-8 leading-relaxed">
          We couldn't find a changelog draft with ID <code className="text-xs bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300 font-mono">{id}</code>. It might have been deleted or moved.
        </p>

        {/* Action Button */}
        <Link 
          href="/dashboard/drafts"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors shadow-sm"
        >
          <MoveLeft className="w-4 h-4" />
          Back to Drafts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 min-h-screen text-neutral-200">
      <ChangelogHighlighter />
      {/* Back Button */}
      <Link 
        href="/dashboard/drafts" 
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to drafts
      </Link>

      {/* Header Section */}
      <header className="border-b border-neutral-800 pb-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_STYLES[draft.category]}`}>
            {draft.category.toUpperCase()}
          </span>
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(draft.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            })}
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
          {draft.title}
        </h1>
      </header>

      {/* Content Section (Bullet Points) */}
      <main 
        className="prose prose-invert max-w-none 
          /* Fix Headings */
          prose-h2:text-2xl prose-h2:font-bold prose-h2:text-neutral-100 prose-h2:mt-6 prose-h2:mb-4
          
          /* Fix Bullet Points */
          prose-ul:list-disc prose-ul:pl-5 prose-ul:my-4 prose-ul:space-y-2
          prose-li:text-neutral-300
          
          /* Style the container box to look like VS Code */
          prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800 prose-pre:rounded-xl prose-pre:p-4"
          dangerouslySetInnerHTML={{ __html: draft.body }}
      />
    </div>
  );
}
