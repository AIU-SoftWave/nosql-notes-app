import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to Notes App
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          A simple and elegant note-taking application powered by Next.js and
          NestJS
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/notes"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            View Notes
          </Link>
          <Link
            href="/notes/new"
            className="bg-white hover:bg-gray-100 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white px-8 py-3 rounded-lg font-medium transition-colors border border-gray-300 dark:border-gray-600"
          >
            Create Note
          </Link>
        </div>
      </div>
    </div>
  );
}
