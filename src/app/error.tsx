"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl">⚠️</span>
      </div>
      <h1 className="text-3xl font-medium tracking-tight mb-4">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We apologize for the inconvenience. An unexpected error has occurred on our servers.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex h-12 items-center justify-center rounded-[20px] bg-primary px-8 text-sm font-medium text-primary-foreground shadow-[var(--shadow-premium)] hover-lift"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-[20px] border border-border bg-background px-8 text-sm font-medium hover:bg-muted transition-luxury"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
