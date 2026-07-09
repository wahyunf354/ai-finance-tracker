import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="flex flex-col items-center gap-2">
        <span className="text-6xl" aria-hidden="true">
          📡
        </span>
        <h1 className="text-2xl font-bold text-foreground">You&apos;re offline</h1>
        <p className="text-muted-foreground max-w-xs">
          It looks like you&apos;ve lost your internet connection. Check your
          network settings and try again.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-md bg-purple-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-800 transition-colors"
      >
        Try again
      </Link>
    </div>
  );
}
