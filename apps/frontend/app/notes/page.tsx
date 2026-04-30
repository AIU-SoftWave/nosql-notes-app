"use client";

import Link from "next/link";
import NoteCard from "@/components/NoteCard";
import Loading from "@/components/Loading";
import { useNotes } from "@/lib/api/notes";

export default function NotesPage() {
  const { data: notes = [], isLoading, error } = useNotes();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">
            Failed to fetch notes
          </p>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No notes yet
          </p>
          <Link
            href="/notes/new"
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Create your first note
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          All Notes
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <NoteCard note={note} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
