"use client";
import ReactMarkdown from "react-markdown";

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

export default function NoteCard({ note }: NoteCardProps) {
  const preview =
    note.content.slice(0, 100) + (note.content.length > 100 ? "..." : "");
  const date = new Date(note.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {note.title}
      </h2>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {date}
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        <ReactMarkdown>{preview}</ReactMarkdown>
      </div>
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {note.commentCount > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {note.commentCount} comment{note.commentCount !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
