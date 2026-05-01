"use client";

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    commentCount: number;
    views: number;
  };
}

// Strip markdown syntax to get plain text
function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/#+\s/g, "") // Remove headers
    .replace(/\*\*|__/g, "") // Remove bold/italic markers
    .replace(/\*|_/g, "") // Remove remaining emphasis
    .replace(/`{3}[\s\S]*?`{3}/g, "") // Remove code blocks
    .replace(/`([^`]+)`/g, "$1") // Remove inline code backticks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Replace links with text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Remove images
    .replace(/\n/g, " ") // Replace newlines with spaces
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
}

export default function NoteCard({ note }: NoteCardProps) {
  const plainText = stripMarkdown(note.content);
  const preview =
    plainText.slice(0, 120) + (plainText.length > 120 ? "..." : "");
  const date = new Date(note.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200 dark:border-gray-700 h-64 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 h-14">
        {note.title}
      </h2>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {date}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 grow overflow-hidden">
        {preview}
      </div>
      <div className="mt-auto">
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{note.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {note.commentCount} comment{note.commentCount !== 1 ? "s" : ""}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {note.views}
          </div>
        </div>
      </div>
    </div>
  );
}
