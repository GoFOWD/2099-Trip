"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseModal from "@/feature/common/BaseModal";

export default function FlightDetailModal({ flight, onClose }) {
  const router = useRouter();
  const [selectedSeat, setSelectedSeat] = useState(null);

  const seats = flight.seats || [
    { type: "일반석", price: flight.price },
    { type: "프리미엄", price: flight.price + 80000 },
    { type: "비즈니스", price: flight.price + 180000 },
  ];

  const handlePayment = () => {
    if (!selectedSeat) return alert("좌석 등급을 선택하세요!");
    router.push(
      `/flights/payment?flightId=${flight.id}&seat=${selectedSeat.type}&price=${selectedSeat.price}`
    );
  };

  return (
    <BaseModal title="항공편 상세" onClose={onClose}>
      {/* 기본 정보 */}
      <div className="space-y-1 text-sm mb-3">
        <div className="font-semibold">
          {flight.airline} {flight.flightNo}
        </div>
        <div>
          {flight.departAirport} → {flight.arriveAirport}
        </div>
        <div className="text-xs text-slate-500">
          {flight.departTime} 출발 / {flight.arriveTime} 도착
        </div>
      </div>

      {/* 좌석 선택 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-700 mb-1">좌석 선택</h3>
        <div className="grid grid-cols-1 gap-1">
          {seats.map((seat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSeat(seat)}
              className={`p-3 rounded-[var(--radius-lg)] border text-sm flex justify-between items-center transition ${
                selectedSeat?.type === seat.type
                  ? "bg-[var(--brandColor)] text-white"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              <span>{seat.type}</span>
              <span>{seat.price.toLocaleString()}원</span>
            </button>
          ))}
        </div>
      </div>

      {/* 결제 버튼 */}
      <div className="border-t mt-4 pt-4 flex justify-end gap-3">
        <button onClick={onClose} className="btn_sub">
          닫기
        </button>
        <button onClick={handlePayment} className="btn_broad">
          결제하기
        </button>
      </div>
    </BaseModal>
  );
}
