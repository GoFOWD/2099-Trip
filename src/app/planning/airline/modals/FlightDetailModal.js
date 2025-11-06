"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BaseModal from "@/share/ui/BaseModal";

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
      `/planning/airline/payment?flightId=${flight.id}&seat=${selectedSeat.type}&price=${selectedSeat.price}`
    );
  };

  return (
    <BaseModal title="항공편 상세" onClose={onClose}>
      <div className="space-y-4 text-sm mb-3">
        {/* ✅ 항공권 대표 정보 */}
        <div className="font-semibold text-[var(--brandColor)]">
          {flight.airline} {flight.flightNo}
        </div>

        {/* ✅ 다구간/왕복/편도 구간 개수 표시 */}
        <div className="text-xs text-slate-500">
          총 {flight.segments?.length || 1}회 탑승
        </div>

        <hr className="my-2" />

        {/* ✅ 각 세그먼트(구간)별 정보 출력 */}
        {flight.segments?.map((seg, idx) => (
          <div
            key={seg.id || idx}
            className="border rounded-lg p-3 bg-slate-50 space-y-1"
          >
            <div className="font-semibold text-[var(--brandColor)]">
              {idx + 1}구간
            </div>

            <div className="text-xs">항공편 번호: {seg.flightNumber}</div>

            {/* ✅ 탑승 날짜 */}
            <div className="text-sm font-semibold mt-1">
              탑승 날짜: {seg.departureDate}
            </div>

            {/* ✅ 출발 정보 */}
            <div className="text-xs text-slate-600">
              출발: {seg.departureDate} {seg.departureTime}
              <br />
              공항: {seg.departurePort} (터미널 {seg.departureTerminal || "-"})
            </div>

            {/* ✅ 도착 정보 */}
            <div className="text-xs text-slate-600">
              도착: {seg.arrivalDate} {seg.arrivalTime}
              <br />
              공항: {seg.arrivalPort} (터미널 {seg.arrivalTerminal || "-"})
            </div>
          </div>
        ))}

        <hr className="my-3" />
      </div>

      {/* ✅ 좌석 선택 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-700 mb-1">좌석 선택</h3>
        <div className="grid grid-cols-1 gap-1">
          {seats.map((seat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSeat(seat)}
              className={`p-3 rounded-lg border text-sm flex justify-between items-center transition ${
                selectedSeat?.type === seat.type
                  ? "bg-[var(--brandColor)] text-white border-[var(--brandColor)]"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              <span>{seat.type}</span>
              <span>{seat.price.toLocaleString()}원</span>
            </button>
          ))}
        </div>
      </div>

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
