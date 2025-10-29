"use client"; // 👈 클라이언트 컴포넌트로 지정

export default function FlightCard({ flight, onDetail }) {
  const logoSrc = flight.airlineLogo || "/default-airline.png";

  return (
    <article className="py-1 my-1 bg-white rounded-2xl shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-1">
        <div className="m-1 w-3 h-3 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
          {/* 일반 <img> 태그 사용 */}
          <img
            src={logoSrc}
            alt={flight.airline || "기본 항공사 로고"}
            width={40}
            height={40}
            className="object-contain"
            onError={(e) => {
              e.target.src = "/default-airline.png";
            }} // fallback 안전장치
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
        <div className="text-l font-bold mx-2">{flight.price}원</div>
        <button
          onClick={() => onDetail(flight)}
          className="mt-1 mr-2 text-sm px-1 py-[5px] rounded-md text-white"
          style={{ background: "#63A3AD" }}
        >
          세부사항
        </button>
      </div>
    </article>
  );
}
