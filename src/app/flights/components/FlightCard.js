"use client";

export default function FlightCard({ flight, onDetail }) {
  const logoSrc = flight.airlineLogo || "/default-airline.png";

  return (
    <article className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
          <img
            src={logoSrc}
            alt={flight.airline}
            className="w-full h-full object-contain"
          />
        </div>

        <div>
          <div className="font-semibold text-sm">
            {flight.airline} {flight.flightNo}
          </div>
          <div className="text-xs text-slate-500">
            {flight.departAirport} → {flight.arriveAirport}
          </div>
          <div className="text-xs text-slate-400 mt-1">{flight.duration}</div>
        </div>
      </div>

      <div className="text-right">
        <div className="text-xl font-bold text-[var(--brandColor)]">
          {flight.price}원
        </div>
        <button
          onClick={() => onDetail(flight)}
          className="mt-2 text-sm px-3 py-1 rounded-md text-white"
          style={{ background: "var(--brandColor)" }}
        >
          세부사항
        </button>
      </div>
    </article>
  );
}
