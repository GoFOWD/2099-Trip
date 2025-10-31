"use client";
import { useState } from "react";
import PassengerSelector from "./PassengerSelector";

const SearchForm = ({ onSearch }) => {
  const [from, setFrom] = useState("ICN");
  const [to, setTo] = useState("NRT");
  const [directOnly, setDirectOnly] = useState(false);
  const [passengers, setPassengers] = useState({});

  return (
    <section
      className="card p-2 rounded-[var(--radius-lg)] shadow-sm space-y-2"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
        <input
          placeholder="출발 공항"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="input border rounded-[var(--radius-lg)] p-1"
        />
        <input
          placeholder="도착 공항"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="input border rounded-[var(--radius-lg)] p-1"
        />
        <PassengerSelector onChange={setPassengers} />
      </div>

      <div className="flex justify-between items-center pt-1">
        <label className="flex items-center gap-1 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={directOnly}
            onChange={(e) => setDirectOnly(e.target.checked)}
          />
          직항만 보기
        </label>
        <button
          onClick={() => onSearch({ from, to, passengers, directOnly })}
          className="btn_broad text-sm px-4 py-2"
        >
          검색
        </button>
      </div>
    </section>
  );
};

export default SearchForm;
