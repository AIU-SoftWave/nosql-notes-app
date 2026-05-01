"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import NoteCard from "@/components/NoteCard";
import Loading from "@/components/Loading";
import { useNotes } from "@/lib/api/notes";

function TagFilter({
  tags,
  activeTag,
  onTagClick,
  onClear,
}: {
  tags: string[];
  activeTag: string | null;
  onTagClick: (tag: string) => void;
  onClear: () => void;
}) {
  if (tags.length === 0 && !activeTag) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
        Tags:
      </span>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagClick(tag)}
          className={`text-sm px-3 py-1 rounded-full transition-colors ${
            activeTag === tag
              ? "bg-blue-600 text-white"
              : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
          }`}
        >
          {tag}
        </button>
      ))}
      {activeTag && (
        <button
          onClick={onClear}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline ml-2"
        >
          Clear tag
        </button>
      )}
    </div>
  );
}

export default function NotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTag = searchParams.get("tag");
  const urlSearch = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(urlSearch);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim().length >= 2) {
      params.set("search", searchInput.trim());
    } else if (searchInput.trim().length === 0) {
      params.delete("search");
    } else {
      return;
    }
    router.push(`/notes?${params.toString()}`, { scroll: false });
  };

  const {
    data: notes = [],
    isLoading,
    error,
  } = useNotes(activeTag || undefined, urlSearch || undefined);

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    if (activeTag === tag) {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    router.push(`/notes?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    setSearchInput("");
    router.push("/notes", { scroll: false });
  };

  const handleClearTag = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("tag");
    router.push(`/notes?${params.toString()}`, { scroll: false });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    router.push(`/notes?${params.toString()}`, { scroll: false });
    searchInputRef.current?.focus();
  };

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

  // Get all unique tags from notes (limited to those matching current search if any)
  const uniqueTags = Array.from(
    new Set(
      notes.flatMap((n) => n.tags).filter((t): t is string => Boolean(t)),
    ),
  ).sort();

  // If we have an active tag but the backend doesn't filter it locally (depends on API implementation)
  // We'll trust the API for now since we updated useNotes to pass the tag.
  const displayNotes = notes;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {activeTag || searchParams.get("search")
              ? "Filtered Notes"
              : "All Notes"}
          </h1>
          <Link
            href="/notes/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            New Note
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative grow">
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search notes by title or content (min 2 chars)..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Search
            </button>
          </form>

          <TagFilter
            tags={uniqueTags}
            activeTag={activeTag}
            onTagClick={handleTagClick}
            onClear={handleClearTag}
          />

          {(activeTag || searchParams.get("search")) && (
            <div className="flex justify-end">
              <button
                onClick={handleClearAll}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {displayNotes.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No notes found matching your criteria.
            </p>
            <button
              onClick={handleClearAll}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayNotes.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <NoteCard note={note} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
