"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FlightDetailModal = ({ flight, onClose }) => {
  const router = useRouter();
  const [selectedSeat, setSelectedSeat] = useState("economy");

  const seatOptions = [
    {
      key: "economy",
      name: "일반석",
      carryOn: "1개 / 7kg",
      baggage: "15kg",
      price: flight.price,
    },
    {
      key: "premium",
      name: "프리미엄석",
      carryOn: "2개 / 10kg",
      baggage: "25kg",
      price: flight.price + 80000,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative bg-white rounded-[var(--radius-lg)] w-full max-w-lg mx-4 p-6 z-10"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold text-[var(--brandColor)]">
            항공권 세부사항
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src={flight.airlineLogo || "/default-airline.png"}
              alt={flight.airline}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <div className="font-semibold text-slate-700 text-sm">
              {flight.airline} {flight.flightNo}
            </div>
            <div className="text-xs text-slate-500">
              {flight.departAirport} → {flight.arriveAirport}
            </div>
          </div>
        </div>

        {/* 좌석 옵션 */}
        <div className="space-y-3 mb-4">
          {seatOptions.map((opt) => (
            <label
              key={opt.key}
              className={`block border rounded-xl p-4 cursor-pointer ${
                selectedSeat === opt.key
                  ? "border-[var(--brandColor)] bg-[var(--subColor)]"
                  : "border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{opt.name}</span>
                <input
                  type="radio"
                  checked={selectedSeat === opt.key}
                  onChange={() => setSelectedSeat(opt.key)}
                />
              </div>
              <ul className="text-xs text-slate-600 mt-2 space-y-1">
                <li>휴대 수하물: {opt.carryOn}</li>
                <li>위탁 수하물: {opt.baggage}</li>
              </ul>
              <div className="text-right text-sm font-bold mt-2">
                {opt.price.toLocaleString()}원
              </div>
            </label>
          ))}
        </div>

        {/* 하단 결제 버튼 */}
        <div className="border-t pt-4 flex justify-between items-center">
          <span className="text-sm">
            선택한 좌석:{" "}
            <strong className="text-[var(--brandColor)]">
              {seatOptions.find((s) => s.key === selectedSeat).name}
            </strong>
          </span>
          <button
            onClick={() => router.push("/flights/payment")}
            className="btn_broad"
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailModal;
