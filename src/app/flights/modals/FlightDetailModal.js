"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FlightDetailModal({ flight, onClose }) {
  const router = useRouter();
  const [selectedSeat, setSelectedSeat] = useState(null);

  const handlePayment = () => {
    if (!selectedSeat) return alert("좌석을 선택해주세요.");

    // 쿼리 기반 URL로 이동
    router.push(
      `/flights/payment?flightId=${flight.id}&seat=${encodeURIComponent(
        selectedSeat.type
      )}&price=${selectedSeat.price}`
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative bg-white rounded-[var(--radius-lg)] w-full max-w-lg mx-4 p-6 z-10"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold text-[var(--brandColor)]">
            항공편 세부 정보
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl"
          >
            ×
          </button>
        </div>

        {/* 항공편 기본 정보 */}
        <section className="mb-4">
          <h3 className="font-semibold mb-1 text-sm text-slate-700">
            {flight.airline} {flight.flightNo}
          </h3>
          <div className="text-sm">
            {flight.departAirport} → {flight.arriveAirport}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {flight.departTime} 출발 / {flight.arriveTime} 도착
          </div>
        </section>

        {/* 좌석 선택 */}
        <section className="mb-4">
          <h3 className="font-semibold mb-2 text-sm text-slate-700">
            좌석 선택
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {flight.seats?.map((seat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSeat(seat)}
                className={`p-3 rounded-lg border text-left ${
                  selectedSeat?.type === seat.type
                    ? "border-[var(--brandColor)] bg-[var(--subColor)]"
                    : "border-slate-200"
                }`}
              >
                <div className="font-semibold text-sm">{seat.type}</div>
                <div className="text-xs text-slate-500">
                  {seat.price.toLocaleString()}원
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 결제 진행 */}
        <div className="border-t pt-4 flex justify-end gap-2">
          <button onClick={onClose} className="btn_sub">
            닫기
          </button>
          <button onClick={handlePayment} className="btn_broad">
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
