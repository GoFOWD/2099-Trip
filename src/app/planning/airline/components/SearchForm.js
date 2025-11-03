"use client";
import { useState } from "react";
import PassengerSelector from "./PassengerSelector";

const SearchForm = ({ onSearch }) => {
  const [from, setFrom] = useState("ICN");
  const [to, setTo] = useState("NRT");
  const [directOnly, setDirectOnly] = useState(false);
  const [passengers, setPassengers] = useState({});

  return (
    <section className="bg-white rounded-2xl p-2 shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        <input
          placeholder="출발 공항"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border rounded-lg p-1"
        />
        <input
          placeholder="도착 공항"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border rounded-lg p-1"
        />
        <PassengerSelector onChange={setPassengers} />
      </div>
      <div className="mt-2 flex justify-between">
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={directOnly}
            onChange={(e) => setDirectOnly(e.target.checked)}
          />{" "}
          직항만 보기
        </label>
        <button
          onClick={() => onSearch({ from, to, passengers, directOnly })}
          className="px-2 py-[6px] rounded-xl text-white"
          style={{ background: "#63A3AD" }}
        >
          검색
        </button>
      </div>
    </section>
  );
};
export default SearchForm;
