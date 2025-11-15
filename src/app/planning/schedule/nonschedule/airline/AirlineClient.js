"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import Header from "@/share/ui/Header";
import ProgressBar from "@/share/ui/ProgressBar";

import TravelCard from "./components/TravelCard";
import SearchForm from "./components/SearchForm";
import SortOptions from "./components/SortOptions";
import FlightCard from "./components/FlightCard";
import FlightDetailModal from "./modals/FlightDetailModal";

import { normalizeFlightList } from "@/lib/airline/normalizeFlight";

/* 날짜 포맷 */
function fmt(d = new Date()) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
}

function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return fmt(d);
}

export default function AirlineClient({ scheduleId }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  if (status === "loading") return null; // 세션 준비 전이면 아무것도 렌더링 X

  const [results, setResults] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const [startDate, setStartDate] = useState(fmt(new Date()));
  const [endDate, setEndDate] = useState(addDays(new Date(), 2));

  /* 스케줄 날짜 불러오기 */
  useEffect(() => {
    if (!scheduleId) return;

    (async () => {
      try {
        const res = await fetch(`/api/schedule/${scheduleId}`, {
          cache: "no-store",
        });

        if (!res.ok) return;

        const json = await res.json();

        if (json?.startDate && json?.endDate) {
          setStartDate(json.startDate.split("T")[0]);
          setEndDate(json.endDate.split("T")[0]);
        }
      } catch {}
    })();
  }, [scheduleId]);

  /* 항공권 검색 */
  const handleSearch = async (data) => {
    try {
      const {
        tripType,
        from,
        to,
        departureDate,
        returnDate,
        segments,
        passengers,
        directOnly,
      } = data;

      if (departureDate) setStartDate(departureDate);
      if (returnDate) setEndDate(returnDate);

      let json;

      if (tripType === "MULTI") {
        const res = await fetch("/api/airline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currencyCode: "KRW",
            adults: passengers?.adults ?? 1,
            children: passengers?.children ?? 0,
            infants: passengers?.infants ?? 0,
            nonStop: directOnly || false,
            multiSegments: segments.map((s) => ({
              origin: s.origin,
              destination: s.destination,
              date: s.date,
            })),
          }),
        });
        json = await res.json();
      } else {
        const params = new URLSearchParams({
          originLocationCode: from,
          destinationLocationCode: to,
          departureDate,
          adults: passengers?.adults ?? 1,
          children: passengers?.children ?? 0,
          infants: passengers?.infants ?? 0,
          nonStop: directOnly ? "true" : "false",
          currencyCode: "KRW",
        });

        if (tripType === "ROUND_TRIP" && returnDate) {
          params.set("returnDate", returnDate);
        }

        const res = await fetch(`/api/airline?${params.toString()}`);
        json = await res.json();
      }

      const refined = normalizeFlightList(json?.data || []);
      setResults(refined);
    } catch (err) {
      console.error("검색 오류:", err);
      setResults([]);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header>
        <ProgressBar step={6} total={10} />
        <TravelCard
          destination="여행지"
          startDate={startDate}
          endDate={endDate}
          budget="80만원"
        />
      </Header>

      <main className="max-w-3xl mx-auto p-2 space-y-2">
        <SearchForm
          onSearch={handleSearch}
          initialTripType="ROUND_TRIP"
          initialDepartureDate={startDate}
          initialReturnDate={endDate}
        />

        <SortOptions />

        {results.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onDetail={setSelectedFlight}
          />
        ))}
      </main>

      {selectedFlight && (
        <FlightDetailModal
          flight={selectedFlight}
          scheduleId={scheduleId}
          userId={userId} // ⭐ 전달
          startDate={startDate} // ⭐ 전달
          endDate={endDate} // ⭐ 전달
          onClose={() => setSelectedFlight(null)}
        />
      )}
    </div>
  );
}
