"use client";

export default function TravelCard({
  destination,
  startDate,
  endDate,
  budget,
}) {
  return (
    <div
      className="
        bg-white rounded-[var(--radius-lg)] shadow-sm
        p-3 flex justify-between items-center
      "
    >
      <div>
        <div className="text-sm font-semibold text-[var(--brandColor)]">
          여행지
        </div>
        <div className="text-lg font-bold">{destination}</div>
        <div className="text-xs text-slate-500">
          {startDate} ~ {endDate}
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm text-slate-500">예산</div>
        <div className="text-xl font-bold text-[var(--brandColor)]">
          {budget}
        </div>
      </div>
    </div>
  );
}
