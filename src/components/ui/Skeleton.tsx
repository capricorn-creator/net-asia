interface Props {
  rows?: number;
  className?: string;
}

function SkeletonLine({ width = '100%', height = 16 }: { width?: string; height?: number }) {
  return (
    <div
      className="rounded-lg animate-pulse"
      style={{ width, height, background: 'rgba(255,255,255,0.06)' }}
    />
  );
}

export function SkeletonCard({ rows = 4 }: Props) {
  return (
    <div className="card p-6 space-y-4">
      <SkeletonLine width="40%" height={20} />
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine key={i} width={`${60 + Math.random() * 30}%`} height={14} />
      ))}
    </div>
  );
}

export function SkeletonResult() {
  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="space-y-2 flex-1">
          <SkeletonLine width="30%" height={20} />
          <SkeletonLine width="50%" height={14} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <SkeletonLine width="40%" height={12} />
            <SkeletonLine width="70%" height={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ rows = 3, className = '' }: Props) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine key={i} />
      ))}
    </div>
  );
}
