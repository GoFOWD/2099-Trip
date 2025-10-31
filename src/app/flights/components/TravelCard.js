"use client";

export default function TravelCard({
  destination,
  startDate,
  endDate,
  budget,
}) {
  return (
    <div
      className="card rounded-[var(--radius-lg)] p-3 mt-2 text-sm flex justify-between items-center"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <div>
        <div className="font-semibold text-[var(--brandColor)]">
          ✈️ 여행지: {destination}
        </div>
        <div className="text-slate-600 mt-1">
          일정: {startDate} ~ {endDate}
        </div>
      </div>

      <div className="text-right">
        <div className="text-slate-500 text-xs">예산</div>
        <div className="font-semibold text-[var(--color-text)]">{budget}</div>
      </div>
    </div>
  );
}
