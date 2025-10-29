"use client";
import { useState } from "react";

// 공용 컴포넌트
import Header from "@/feature/common/Header";
import ProgressBar from "@/feature/common/ProgressBar";
import FooterNav from "@/feature/common/FooterNav";

// flights 전용
import TravelCard from "./components/TravelCard";
import SearchForm from "./components/SearchForm";
import SortOptions from "./components/SortOptions";
import FlightCard from "./components/FlightCard";
import FlightDetailModal from "./modals/FlightDetailModal";
import { sampleResults } from "./components/utils/sampleResults";

export default function FlightsPage() {
  const [results] = useState(sampleResults());
  const [selected, setSelected] = useState(null);

  return (
    <div>
      {/* Header가 children을 받도록 변경됨 */}
      <Header>
        <ProgressBar step={6} total={10} />
        <TravelCard
          destination="파리, 프랑스"
          startDate="2025-10-01"
          endDate="2025-10-09"
          budget="80만원"
        />
      </Header>

      <main className="flex-1 overflow-y-auto pb-[80px] max-w-3xl mx-auto">
        <SearchForm onSearch={(data) => console.log("search", data)} />
        <SortOptions onChange={(sortType) => console.log("정렬:", sortType)} />
        {results.map((r) => (
          <FlightCard key={r.id} flight={r} onDetail={setSelected} />
        ))}
      </main>

      <FooterNav />

      {selected && (
        <FlightDetailModal
          flight={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
