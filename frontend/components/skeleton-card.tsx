export function SkeletonCard() {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-4 flex-1 rounded" />
          ))}
        </div>
      </div>
      {/* Rows */}
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="p-4 border-b border-border/50">
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton h-4 flex-1 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
