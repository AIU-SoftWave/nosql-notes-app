"use client";

import { useState, useRef, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import NoteCard from "@/components/NoteCard";
import Loading from "@/components/Loading";
import { useNotes, useSortAlgorithms, SortOption, SortAlgorithm } from "@/lib/api/notes";

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
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Tags:</span>
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

function Pagination({ pagination, onPageChange, onLimitChange }: {
  pagination: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
        <select
          value={pagination.limit}
          onChange={(e) => onLimitChange(parseInt(e.target.value))}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span className="text-sm text-gray-600 dark:text-gray-400">of {pagination.total} notes</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.hasPrev}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasNext}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function PerformanceBadge({ performance }: { performance: { executionTimeMs: number; algorithmName: string; timeComplexity: string } }) {
  return (
    <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-3 mt-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-green-700 dark:text-green-300 uppercase">Performance</span>
          <div className="text-lg font-bold text-green-800 dark:text-green-200">
            {performance.executionTimeMs} ms
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-green-700 dark:text-green-300">{performance.algorithmName}</div>
          <div className="text-xs text-green-600 dark:text-green-400">{performance.timeComplexity}</div>
        </div>
      </div>
    </div>
  );
}

function NotesList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTag = searchParams.get("tag");
  const urlSearch = searchParams.get("search") || "";
  const urlSort = (searchParams.get("sort") as SortOption) || "newest";
  const urlAlgorithm = (searchParams.get("algorithm") as SortAlgorithm) || "merge";
  const urlPage = parseInt(searchParams.get("page") || "1");
  const urlLimit = parseInt(searchParams.get("limit") || "10");

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [sortOption, setSortOption] = useState<SortOption>(urlSort);
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>(urlAlgorithm);
  const [page, setPage] = useState(urlPage);
  const [limit, setLimit] = useState(urlLimit);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: sortAlgorithms = [] } = useSortAlgorithms();

  const { data: response, isLoading, error } = useNotes(
    activeTag || undefined,
    urlSearch || undefined,
    urlSort,
    urlAlgorithm,
    urlPage,
    urlLimit,
  );

  const notes = response?.data || [];
  const pagination = response?.pagination;
  const performance = response?.performance;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim().length >= 2) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`/notes?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    params.set("sort", newSort);
    params.set("page", "1");
    router.push(`/notes?${params.toString()}`, { scroll: false });
  };

  const handleAlgorithmChange = (newAlgo: SortAlgorithm) => {
    setAlgorithm(newAlgo);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    params.set("algorithm", newAlgo);
    params.set("page", "1");
    router.push(`/notes?${params.toString()}`, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/notes?${params.toString()}`, { scroll: false });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    params.set("limit", newLimit.toString());
    params.set("page", "1");
    router.push(`/notes?${params.toString()}`, { scroll: false });
  };

  const handleTagClick = (tag: string) => {
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (activeTag === tag) {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    params.set("page", "1");
    router.push(`/notes?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    setSearchInput("");
    setPage(1);
    router.push("/notes", { scroll: false });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    searchInputRef.current?.focus();
  };

  const allTags = useMemo(() => {
    return Array.from(new Set(notes.flatMap((n) => n.tags))).sort();
  }, [notes]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg">Failed to fetch notes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {activeTag || searchParams.get("search") ? "Filtered Notes" : "All Notes"}
          </h1>
          <Link href="/notes/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium">
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
                placeholder="Search notes..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
              />
              {searchInput && (
                <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ✕
                </button>
              )}
            </div>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-900"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="alpha">A-Z</option>
              <option value="views">Most Views</option>
              <option value="comments">Most Comments</option>
            </select>
            <select
              value={algorithm}
              onChange={(e) => handleAlgorithmChange(e.target.value as SortAlgorithm)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-900"
            >
              {sortAlgorithms.map((algo) => (
                <option key={algo.id} value={algo.id}>
                  {algo.name}
                </option>
              ))}
            </select>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium">
              Search
            </button>
          </form>

          <TagFilter tags={allTags} activeTag={activeTag} onTagClick={handleTagClick} onClear={() => handleTagClick(activeTag || "")} />

          {(activeTag || searchParams.get("search")) && (
            <div className="flex justify-end">
              <button onClick={handleClearAll} className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-medium">
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {performance && <PerformanceBadge performance={performance} />}

        {notes.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No notes found.</p>
            <button onClick={handleClearAll} className="text-blue-600 hover:text-blue-700 font-medium">
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <Link key={note.id} href={`/notes/${note.id}`}>
                  <NoteCard note={note} />
                </Link>
              ))}
            </div>

            {pagination && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <NotesList />
    </Suspense>
  );
}