export default function HomeSkeleton() {
  return (
    <main className="bg-custom-white animate-pulse px-5 pt-6 pb-32">
      {/* Title Skeleton */}
      <div className="mb-5 space-y-2">
        <div className="h-8 w-40 rounded bg-slate-200"></div>
      </div>

      {/* ProfileCard Skeleton */}
      <div className="mb-8 flex gap-2">
        {/* Left Card */}
        <div className="flex min-w-[128px] flex-col items-center justify-center rounded-[10px] bg-white py-[18px]">
          <div className="mb-3 h-[70px] w-[70px] rounded-full bg-slate-200"></div>
          <div className="mb-1 h-7 w-12 rounded bg-slate-200"></div>
          <div className="h-5 w-24 rounded bg-slate-200"></div>
        </div>

        {/* Right Card */}
        <div className="flex w-full flex-col gap-2">
          <div className="mb-2 flex flex-1 flex-col justify-between rounded-[10px] bg-white px-5 py-4">
            <div className="flex flex-col gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-start gap-1">
                  <div className="mb-0.5 h-[13px] w-12 rounded-[30px] bg-slate-200"></div>
                  <div className="h-[15px] w-32 rounded bg-slate-200"></div>
                </div>
              ))}
            </div>
          </div>
          {/* Button Skeleton */}
          <div className="h-[34px] w-full rounded-[10px] bg-slate-200"></div>
        </div>
      </div>

      <div className="space-y-4">
        {/* NotificationCard Skeleton */}
        <div className="mb-5 flex h-32 w-full items-center justify-center rounded-[10px] border border-gray-100 bg-white px-3.5 py-6 shadow-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="mb-2 flex items-center -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-white bg-slate-200"
                ></div>
              ))}
            </div>
            <div className="h-4 w-32 rounded bg-slate-200"></div>
          </div>
        </div>

        {/* MatchingCard Skeleton */}
        <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-slate-200 p-6 shadow-lg">
          {/* Invisible spacers to maintain exact height */}
          <div className="mb-8 h-9 w-9 rounded opacity-0"></div>

          <div className="flex flex-col items-center gap-2 opacity-0">
            <div className="mb-8 h-9 w-40 rounded"></div>
            <div className="h-6 w-48 rounded"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
