"use client";

export default function ProgressBar({ step = 1, total = 10 }) {
  const percent = (step / total) * 100;

  return (
    <div className="mb-1">
      <div className="text-sm text-slate-500">
        단계 {step}/{total}
      </div>
      <div className="mt-1 bg-slate-200 rounded-full h-1 overflow-hidden">
        <div
          className="h-1 rounded-full transition-all"
          style={{
            width: `${percent}%`,
            background: "var(--brandColor)",
          }}
        />
      </div>
    </div>
  );
}
