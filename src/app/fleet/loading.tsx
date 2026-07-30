import { SlidersHorizontal, Search, ChevronDown } from "lucide-react";

export default function FleetLoading() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 animate-pulse">
      {/* Search Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-border/40 pb-8">
        <div className="w-full md:max-w-md h-14 rounded-2xl bg-muted/60" />
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="lg:hidden flex-1 h-12 rounded-xl bg-muted/60" />
          <div className="w-full md:w-48 h-12 rounded-xl bg-muted/60" />
        </div>
      </div>

      <div className="flex gap-10">
        {/* Sidebar Filters Skeleton */}
        <div className="hidden lg:flex flex-col gap-8 w-64 shrink-0">
          <div className="w-24 h-6 bg-muted/60 rounded mb-2" />
          <div className="w-full h-10 bg-muted/60 rounded-xl" />
          <div className="w-full h-10 bg-muted/60 rounded-xl" />
          <div className="w-full h-10 bg-muted/60 rounded-xl" />
          <div className="w-full h-32 bg-muted/60 rounded-xl" />
          <div className="w-full h-12 bg-muted/60 rounded-xl mt-4" />
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <div className="w-64 h-8 bg-muted/60 rounded mb-2" />
            <div className="w-48 h-4 bg-muted/60 rounded" />
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="aspect-[4/3] rounded-3xl bg-muted/60" />
                <div className="w-3/4 h-6 bg-muted/60 rounded mt-2" />
                <div className="w-1/2 h-4 bg-muted/60 rounded" />
                <div className="w-full h-4 bg-muted/60 rounded" />
                <div className="w-1/3 h-6 bg-muted/60 rounded mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
