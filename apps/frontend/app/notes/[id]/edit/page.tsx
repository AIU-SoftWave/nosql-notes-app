"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useNote, useUpdateNote } from "@/lib/api/notes";
import Link from "next/link";
import Loading from "@/components/Loading";
import MarkdownEditorLite from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: note, isLoading, error } = useNote(id);
  const updateNote = useUpdateNote();

  const initializedRef = useRef(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");

  // Pre-fill form when note data loads (only once)
  useEffect(() => {
    if (note && !initializedRef.current) {
      initializedRef.current = true;
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags.join(", "));
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }

    // Parse tags
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await updateNote.mutateAsync({
        id,
        data: {
          title: title.trim(),
          content: content.trim(),
          tags: parsedTags,
        },
      });
      router.push(`/notes/${id}`);
    } catch {
      setFormError("Failed to update note");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !note) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Note Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The note you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/notes"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/notes/${id}`}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Note
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Edit Note
        </h1>

        {formError && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter note title"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Content
            </label>
            <MarkdownEditorLite
              value={content}
              onChange={({ text }) => setContent(text)}
              renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
              style={{
                height: "400px",
                border: "1px solid rgb(209 213 219)",
                borderRadius: "0.375rem",
              }}
              className="dark:bg-gray-800 dark:border-gray-600"
              placeholder="Enter note content (Markdown supported)"
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tags separated by commas (e.g., work, important)"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Tags must be lowercase, alphanumeric with hyphens, max 20
              characters
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={updateNote.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateNote.isPending ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href={`/notes/${id}`}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-3 rounded-md font-medium text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
