// src/app/flights/page.js
"use client";
import { useState } from "react";
import Header from "@/feature/common/Header";
import ProgressBar from "@/feature/common/ProgressBar";
import TravelCard from "./components/TravelCard";
import SearchForm from "./components/SearchForm";
import SortOptions from "./components/SortOptions";
import FlightCard from "./components/FlightCard";
import FlightDetailModal from "./modals/FlightDetailModal";
import FooterNav from "@/feature/common/FooterNav";
import { sampleResults } from "./components/utils/sampleResults";

export default function FlightsPage() {
  const [results] = useState(sampleResults());
  const [selectedFlight, setSelectedFlight] = useState(null);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-20">
      <Header>
        <ProgressBar step={6} total={10} />
        <TravelCard
          destination="파리, 프랑스"
          startDate="2025-10-01"
          endDate="2025-10-09"
          budget="80만원"
        />
      </Header>

      <main className="max-w-3xl mx-auto p-1 space-y-2">
        <SearchForm onSearch={(data) => console.log("search", data)} />
        <SortOptions onChange={(sortType) => console.log("정렬:", sortType)} />
        {results.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onDetail={setSelectedFlight}
          />
        ))}
      </main>

      <FooterNav />

      {selectedFlight && (
        <FlightDetailModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
        />
      )}
    </div>
  );
}
