"use client";
import { useState } from "react";

export default function PassengerSelector({ onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const total = passengers.adults + passengers.children + passengers.infants;

  const update = (key, delta) => {
    setPassengers((prev) => {
      const value = Math.max(0, prev[key] + delta);
      const next = { ...prev, [key]: value };
      onChange?.(next);
      return next;
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border rounded-lg p-2 text-sm flex justify-between items-center"
      >
        <span>탑승객 {total}명</span>
        <span className="text-slate-400">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div
          className="
            absolute z-10 bg-white border shadow-md
            rounded-[var(--radius-lg)] mt-2 w-full
          "
        >
          {["adults", "children", "infants"].map((type, i) => {
            const label =
              type === "adults"
                ? "성인"
                : type === "children"
                ? "소아"
                : "유아";
            return (
              <div
                key={i}
                className="flex justify-between items-center p-2 text-sm border-b last:border-0"
              >
                <span>{label}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => update(type, -1)}
                    className="px-2 py-1 bg-slate-100 rounded"
                  >
                    -
                  </button>
                  <span>{passengers[type]}</span>
                  <button
                    onClick={() => update(type, +1)}
                    className="px-2 py-1 bg-slate-100 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
