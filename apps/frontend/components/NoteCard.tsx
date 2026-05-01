"use client";

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    commentCount: number;
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
        {note.commentCount > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {note.commentCount} comment{note.commentCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
