"use client";
import BaseModal from "@/share/ui/BaseModal";

export default function BookingDetailModal({ onClose, booking }) {
  const { flight, passengers, total } = booking;

  return (
    <BaseModal title="예약 상세 정보" onClose={onClose}>
      <section className="mb-4">
        <h3 className="font-semibold mb-2 text-sm text-slate-700">
          항공편 정보
        </h3>
        <div className="text-sm">
          {flight.airline} {flight.flightNo}
          <br />
          {flight.departAirport} → {flight.arriveAirport}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {flight.departTime} 출발 / {flight.arriveTime} 도착
        </div>
      </section>

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

      <section className="mb-2">
        <h3 className="font-semibold mb-2 text-sm text-slate-700">결제 금액</h3>
        <div className="flex justify-between text-sm">
          <span>항공권 요금</span>
          <span>{total.toLocaleString()}원</span>
        </div>
      </section>

      <div className="border-t mt-4 pt-4 flex justify-end gap-3">
        <button onClick={onClose} className="btn_sub">
          닫기
        </button>
        <button className="btn_broad">결제 진행</button>
      </div>
    </BaseModal>
  );
}
