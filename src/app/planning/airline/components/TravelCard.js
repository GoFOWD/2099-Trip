export default function TravelCard({
  destination,
  startDate,
  endDate,
  budget,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-semibold text-[var(--brandColor)] text-base mb-2">
        ✈ 여행 요약
      </h2>
      <div className="text-sm space-y-1">
        <p>목적지: {destination}</p>
        <p>
          일정: {startDate} ~ {endDate}
        </p>
        <p>예산: {budget}</p>
      </div>
    </div>
  );
}
