export default function Loading() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Minimal Luxury Loading Indicator */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-[1.5px] border-border/40 rounded-full"></div>
          <div className="absolute inset-0 border-[1.5px] border-primary rounded-full border-t-transparent animate-spin duration-1000 ease-in-out"></div>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground animate-pulse uppercase tracking-[0.3em]">
          Loading
        </p>
      </div>
    </div>
  );
}
