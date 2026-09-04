import type { ReactNode } from "react";

interface SkeletonProps {
  className?: string;
}

/**
 * Base pulsing placeholder block. Every other skeleton in this module is
 * composed from this one so the animation/shape tokens stay in one place.
 */
export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-lg bg-gray-200/60 animate-pulse ${className}`}
    />
  );
}

/** Stacked text lines, last one shorter (classic paragraph shape). */
export function SkeletonText({
  lines = 3,
  className = "",
}: SkeletonProps & { lines?: number }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3.5 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

/** Small inline block for replacing "Loading..." count labels. */
export function SkeletonCount({ className = "" }: SkeletonProps) {
  return (
    <Skeleton
      className={`inline-block h-3.5 w-16 rounded align-middle ${className}`}
    />
  );
}

/** Compact avatar + title + meta row, used by lists and tables. */
export function SkeletonList({
  rows = 5,
  className = "",
}: SkeletonProps & { rows?: number }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/** Responsive grid of image cards (hospitals, doctors, blogs). */
export function SkeletonCards({
  count = 6,
  className = "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4",
}: SkeletonProps & { count?: number; className?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100 bg-white p-4"
        >
          <Skeleton className="h-24 w-full rounded-xl" />
          <SkeletonText lines={2} className="mt-3" />
          <Skeleton className="mt-2 h-3.5 w-24" />
        </div>
      ))}
    </div>
  );
}

/** Stat cards row + wide panels, tuned for the analytics dashboards. */
export function SkeletonDashboard({ className = "" }: SkeletonProps) {
  return (
    <div className={`space-y-5 ${className}`}>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="mt-3 h-5 w-16" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 lg:col-span-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-40 w-full" />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <SkeletonText lines={6} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <SkeletonText lines={4} />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <SkeletonText lines={4} />
        </div>
      </div>
    </div>
  );
}

/** Detail/profile page: circular header, banner + info blocks. */
export function SkeletonSingle({ className = "" }: SkeletonProps) {
  return (
    <div className={`space-y-5 ${className}`}>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Skeleton className="h-28 w-28 rounded-full" />
        <div className="w-full flex-1 text-center sm:text-left">
          <Skeleton className="mx-auto h-5 w-40 sm:mx-0" />
          <SkeletonText lines={2} className="mt-3" />
        </div>
      </div>
      <Skeleton className="h-28 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  );
}

/** Article/blog: headline + hero image + paragraphs. */
export function SkeletonArticle({ className = "" }: SkeletonProps) {
  return (
    <div className={`mx-auto max-w-3xl ${className}`}>
      <Skeleton className="mx-auto h-8 w-3/4" />
      <Skeleton className="mt-3 h-4 w-32" />
      <Skeleton className="mt-8 h-56 w-full rounded-2xl" />
      <div className="mt-8 space-y-4">
        {["w-full", "w-11/12", "w-full", "w-5/6"].map((w, i) => (
          <Skeleton key={i} className={`h-3.5 ${w}`} />
        ))}
      </div>
    </div>
  );
}

/** Drop-in wrapper for arbitrary skeleton bodies. */
export function SkeletonBox({ children }: { children: ReactNode }) {
  return <div aria-busy="true">{children}</div>;
}