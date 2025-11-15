"use client";

export default function FlightCard({ flight, onDetail }) {
  const logoSrc = flight.airlineLogo || "/default-airline.png";

  const budget = 800000;
  const diff = flight.price - budget;
  const ratio = (diff / budget) * 100;

  // ✅ 상태 구분 + 표시 단순화
  let status, color, diffText;
  if (ratio > 0) {
    status = "예산 초과";
    color = "text-red-500";
    diffText = `+${Math.round(ratio)}% 초과`;
  } else if (ratio > -20) {
    status = "적정";
    color = "text-[var(--brandColor)]";
    diffText = "예산 근접";
  } else {
    status = "경제적";
    color = "text-green-500";
    diffText = `${Math.abs(Math.round(ratio))}% 여유`;
  }

  return (
    <article
      className="
        bg-white p-4 rounded-[var(--radius-lg)]
        shadow-sm flex items-center justify-between
        hover:shadow-md transition
      "
    >
      <div className="flex items-center gap-3">
        {/* 항공사 로고 */}
        <div
          className="
            w-10 h-10 bg-slate-100 rounded-full
            flex items-center justify-center overflow-hidden
          "
        >
          <img
            src={logoSrc}
            alt={flight.airline}
            className="w-full h-full object-contain"
          />
        </div>

        {/* 항공편 정보 */}
        <div>
          <div className="font-semibold text-sm">{flight.airline}</div>
          <div className="text-xs text-slate-500 leading-tight">
            {flight.departAirport}
            <br />→<br />
            {flight.arriveAirport}
          </div>
          <div className="text-xs text-slate-400 mt-1">{flight.duration}</div>
        </div>
      </div>

      {/* 가격 및 예산 상태 */}
      <div className="text-right">
        <div className="text-lg font-bold text-[var(--brandColor)]">
          {flight.price.toLocaleString()}원
        </div>

        {/* ✅ 예산 상태 + 차이(퍼센트형) */}
        <div className={`text-[11px] font-medium ${color}`}>
          {status} ({diffText})
        </div>

        <button
          onClick={() => onDetail(flight)}
          className="mt-2 text-sm px-3 py-1 rounded-md text-white bg-[var(--brandColor)] hover:bg-[var(--brandColor-hover)]"
        >
          세부사항
        </button>
      </div>
    </article>
  );
}
