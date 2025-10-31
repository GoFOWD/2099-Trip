"use client";

export default function FlightCard({ flight, onDetail }) {
  // 기본 이미지 경로 설정
  const logoSrc = flight.airlineLogo || "/default-airline.png";

  return (
    <article
      className="card flex items-center justify-between p-1 rounded-[var(--radius-lg)]"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      {/* 항공사 정보 */}
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={logoSrc}
            alt={flight.airline}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <div className="font-semibold text-sm text-[var(--color-text)]">
            {flight.airline} {flight.flightNo}
          </div>
          <div className="text-xs text-[var(--color-muted)]">
            {flight.departAirport} → <br /> {flight.arriveAirport}
          </div>
          <div className="text-xs text-slate-400 mt-1">{flight.duration}</div>
        </div>
      </div>

      {/* 가격 및 버튼 */}
      <div className="text-right">
        <div className="text-lg font-bold text-[var(--brandColor)]">
          {flight.price.toLocaleString()}원
        </div>
        <button onClick={() => onDetail(flight)} className="btn_broad">
          세부사항
        </button>
      </div>
    </article>
  );
}
