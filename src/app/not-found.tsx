import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-medium tracking-tighter text-primary mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-10">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" className="inline-flex h-14 items-center justify-center rounded-[20px] bg-primary px-10 text-sm font-medium text-primary-foreground shadow-[var(--shadow-premium)] hover-lift">
        Return Home
      </Link>
    </div>
  );
}
