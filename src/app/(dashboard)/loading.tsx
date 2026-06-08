export default function DashboardLoading() {
  return (
    <div className="space-y-8 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#0d0d0d] via-[#070707] to-[#050503] min-h-full animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-3">
          <div className="h-7 w-72 rounded-md bg-white/[0.06]" />
          <div className="h-4 w-56 rounded-md bg-white/[0.04]" />
        </div>
        <div className="h-9 w-44 rounded-md bg-white/[0.05]" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-5 h-[170px] flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="h-9 w-9 rounded-xl bg-white/[0.05]" />
              <div className="h-4 w-4 rounded bg-white/[0.05]" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-white/[0.05]" />
              <div className="h-7 w-28 rounded bg-white/[0.08]" />
              <div className="h-3 w-16 rounded bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>

      {/* Main panel */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-6 h-[360px]">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-white/[0.06]" />
            <div className="h-8 w-32 rounded bg-white/[0.08]" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-28 rounded-md bg-white/[0.05]" />
            <div className="h-8 w-32 rounded-md bg-white/[0.05]" />
          </div>
        </div>
        <div className="h-[240px] rounded-lg bg-white/[0.02] border border-white/[0.04]" />
      </div>

      {/* List */}
      <div className="space-y-4">
        <div className="h-5 w-32 rounded bg-white/[0.06]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.06] bg-[#0d0d0d] p-5 h-[140px] space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/[0.06]" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 rounded bg-white/[0.06]" />
                  <div className="h-3 w-44 rounded bg-white/[0.04]" />
                </div>
              </div>
              <div className="h-3 w-full rounded bg-white/[0.03]" />
              <div className="h-3 w-2/3 rounded bg-white/[0.03]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
