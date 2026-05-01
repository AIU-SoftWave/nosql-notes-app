"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useNote, useDeleteNote, useAddComment } from "@/lib/api/notes";
import Loading from "@/components/Loading";

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: note, isLoading, error } = useNote(id);
  const deleteNote = useDeleteNote();
  const addComment = useAddComment();
  const [commentContent, setCommentContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await addComment.mutateAsync({
        id,
        content: commentContent.trim(),
      });
      setCommentContent("");
    } catch {
      // Error handling is done by the mutation
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNote.mutateAsync(id);
      router.push("/notes");
    } catch {
      // Error handling is done by the mutation
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/notes"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Notes
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {note.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>Created: {formatDate(note.createdAt)}</span>
              {note.updatedAt !== note.createdAt && (
                <span>Updated: {formatDate(note.updatedAt)}</span>
              )}
            </div>
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
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
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Comments ({note.comments.length})
              </h2>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete Note
              </button>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="mb-4">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a comment..."
                />
              </div>
              <button
                type="submit"
                disabled={!commentContent.trim() || addComment.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addComment.isPending ? "Adding..." : "Add Comment"}
              </button>
            </form>

            {/* Comments List */}
            {note.comments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {note.comments.map((comment, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {formatDate(comment.createdAt)}
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      {comment.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Delete Note
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this note? This action cannot be
                undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  disabled={deleteNote.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteNote.isPending ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
