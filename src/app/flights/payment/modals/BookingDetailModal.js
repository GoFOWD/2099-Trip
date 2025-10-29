"use client";

export default function BookingDetailModal({ onClose, booking }) {
  if (!booking) return null;
  const { flight, passengers, total } = booking;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 모달 본체 */}
      <div
        className="relative bg-white rounded-[var(--radius-lg)] w-full max-w-lg mx-4 p-6 z-10
                   max-h-[calc(100svh-40px)] overflow-y-auto"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold text-[var(--brandColor)]">
            예약 상세 정보
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* 항공편 요약 */}
        <section className="mb-4">
          <h3 className="font-semibold mb-2 text-sm text-slate-700">
            항공편 정보
          </h3>
          <div className="text-sm">
            {flight.airline} {flight.flightNo} <br />
            {flight.departAirport} → {flight.arriveAirport}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {flight.departTime} 출발 / {flight.arriveTime} 도착
          </div>
        </section>

        {/* 탑승객 목록 */}
        <section className="mb-4">
          <h3 className="font-semibold mb-2 text-sm text-slate-700">
            탑승객 정보
          </h3>
          <ul className="space-y-1 text-sm">
            {passengers.map((p, idx) => (
              <li key={idx} className="flex justify-between">
                <span>
                  {p.name} ({p.gender === "M" ? "남" : "여"})
                </span>
                <span className="text-slate-500 text-xs">{p.birth}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 결제 요약 */}
        <section className="mb-2">
          <h3 className="font-semibold mb-2 text-sm text-slate-700">
            결제 금액
          </h3>
          <div className="flex justify-between">
            <span>항공권 요금</span>
            <span>{total.toLocaleString()}원</span>
          </div>
        </section>

        {/* 버튼 영역 */}
        <div className="border-t mt-4 pt-4 flex justify-end gap-3">
          <button onClick={onClose} className="btn_sub">
            닫기
          </button>
          <button className="btn_broad">결제 진행</button>
        </div>
      </div>
    </div>
  );
}
