"use client";

import Link from "next/link";

interface NoteCardProps {
  note: {
    id: string;
    userId: string;
    username: string;
    title: string;
    content: string;
    tags: string[];
    isPublic: boolean;
    createdAt: string;
    commentCount: number;
    views: number;
  };
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/#+\s/g, "")
    .replace(/\*\*|__/g, "")
    .replace(/\*|_/g, "")
    .replace(/`{3}[\s\S]*?`{3}/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function NoteCard({ note }: NoteCardProps) {
  const plainText = stripMarkdown(note.content);
  const preview = plainText.slice(0, 120) + (plainText.length > 120 ? "..." : "");
  const date = new Date(note.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/notes/${note.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200 dark:border-gray-700 h-64 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 h-14">
            {note.title}
          </h2>
          <span className={`text-xs px-2 py-1 rounded ${note.isPublic ? "bg-green-100 dark:bg-green-900 text-green-800" : "bg-gray-100 dark:bg-gray-700 text-gray-600"}`}>
            {note.isPublic ? "Public" : "Private"}
          </span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {date} • by {note.username}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 grow overflow-hidden">
          {preview}
        </div>
        <div className="mt-auto">
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {note.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{note.tags.length - 3}</span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{note.commentCount} comment{note.commentCount !== 1 ? "s" : ""}</span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {note.views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}