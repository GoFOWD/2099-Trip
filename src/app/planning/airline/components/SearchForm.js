"use client";
import { useState } from "react";
import PassengerSelector from "./PassengerSelector";

export default function SearchForm({ onSearch }) {
  const [from, setFrom] = useState("ICN");
  const [to, setTo] = useState("NRT");
  const [directOnly, setDirectOnly] = useState(false);
  const [passengers, setPassengers] = useState({});

  return (
    <section className="bg-white rounded-[var(--radius-lg)] p-3 shadow-sm">
      <div className="grid grid-cols-1 gap-2">
        <input
          placeholder="출발 공항"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border rounded-lg p-2 text-sm"
        />
        <input
          placeholder="도착 공항"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border rounded-lg p-2 text-sm"
        />
        <PassengerSelector onChange={setPassengers} />
      </div>

      <div className="mt-2 flex justify-between items-center">
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={directOnly}
            onChange={(e) => setDirectOnly(e.target.checked)}
          />
          직항만 보기
        </label>

        <button
          onClick={() => onSearch({ from, to, passengers, directOnly })}
          className="btn_broad text-sm"
        >
          검색
        </button>
      </div>
    </section>
  );
}
