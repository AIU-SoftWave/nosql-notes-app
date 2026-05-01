"use client";

import Link from "next/link";
import { useNoteStats, useNoteActivity } from "@/lib/api/notes";
import Loading from "@/components/Loading";

export default function StatsPage() {
  const { data: stats, isLoading: statsLoading } = useNoteStats();
  const { data: activity = [], isLoading: activityLoading } = useNoteActivity(10);

  const isLoading = statsLoading || activityLoading;

  if (isLoading) {
    return <Loading />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/notes"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Notes
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard & Statistics
        </h1>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Total Notes
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {stats?.totalNotes ?? 0}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Total Comments
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {stats?.totalComments ?? 0}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Total Views
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {stats?.totalViews ?? 0}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Top Tags
            </h2>
            {stats?.tags && stats.tags.length > 0 ? (
              <div className="space-y-3">
                {stats.tags.map((tag, index) => (
                  <div key={tag.tag} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-6">
                      #{index + 1}
                    </span>
                    <span className="flex-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                      {tag.tag}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {tag.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No tags yet
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            {activity.length > 0 ? (
              <div className="space-y-3">
                {activity.map((item, index) => (
                  <Link
                    key={`${item.noteId}-${index}`}
                    href={`/notes/${item.noteId}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.type === "note"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <span className="flex-1 text-sm text-gray-900 dark:text-white truncate">
                      {item.title}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(item.createdAt)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.type}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No activity yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}