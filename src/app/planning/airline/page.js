"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/share/ui/Header";
import ProgressBar from "@/share/ui/ProgressBar";

import TravelCard from "./components/TravelCard";
import SearchForm from "./components/SearchForm";
import SortOptions from "./components/SortOptions";
import FlightCard from "./components/FlightCard";
import FlightDetailModal from "./modals/FlightDetailModal";

import { normalizeFlightList } from "./lib/normalizeFlight";

/* 유틸: yyyy-mm-dd */
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

export default function AirlinePage() {
  const searchParams = useSearchParams();
  const scid = searchParams.get("scid"); // ✅ 쿼리로 전달되는 schedule id

  const [results, setResults] = useState([]); // ✅ API 결과 저장
  const [selectedFlight, setSelectedFlight] = useState(null);

  // 화면 기본 날짜 (TravelCard + SearchForm 초기값)
  const [startDate, setStartDate] = useState(fmt(new Date())); // 출발(기본=오늘)
  const [endDate, setEndDate] = useState(addDays(new Date(), 2)); // 도착(기본=+2일)

  // scid가 있으면 스케줄 날짜를 가져와 기본값으로 사용
  useEffect(() => {
    if (!scid) return; // 없으면 기본값 유지
    (async () => {
      try {
        const res = await fetch(`/planning/airline/api/schedule?scid=${scid}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (res.ok && json?.startDate && json?.endDate) {
          // ISO → yyyy-mm-dd
          const s = json.startDate.split("T")[0];
          const e = json.endDate.split("T")[0];
          setStartDate(s);
          setEndDate(e);
        } else {
          console.warn("스케줄 조회 실패 또는 날짜 없음:", json);
        }
      } catch (e) {
        console.error("스케줄 조회 오류:", e);
      }
    })();
  }, [scid]);

  /* ----------------------------------------
     ✅ handleSearch: SearchForm → page.js 검색 요청
     ✅ tripType에 따라 GET/POST 분기 + 정제까지 수행
  ---------------------------------------- */
  const handleSearch = async (data) => {
    try {
      const {
        tripType, // "ONE_WAY" | "ROUND_TRIP" | "MULTI"
        from,
        to,
        departureDate,
        returnDate,
        segments, // MULTI일 때 [{origin, destination, date}]
        passengers,
        directOnly,
      } = data;

      // 화면 상단 TravelCard에도 반영
      if (departureDate) setStartDate(departureDate);
      if (returnDate) setEndDate(returnDate);

      let json;

      if (tripType === "MULTI") {
        // ✅ 다구간 → POST
        const body = {
          currencyCode: "KRW",
          adults: passengers?.adults ?? 1,
          children: passengers?.children ?? 0,
          infants: passengers?.infants ?? 0,
          nonStop: directOnly || false,
          multiSegments: (segments || []).map((s) => ({
            origin: s.origin,
            destination: s.destination,
            date: s.date,
          })),
        };

        const res = await fetch("/planning/airline/api/flights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        json = await res.json();
      } else {
        // ✅ 편도/왕복 → GET
        const params = new URLSearchParams({
          originLocationCode: from,
          destinationLocationCode: to,
          departureDate,
          adults: String(passengers?.adults ?? 1),
          children: String(passengers?.children ?? 0),
          infants: String(passengers?.infants ?? 0),
          nonStop: directOnly ? "true" : "false",
          currencyCode: "KRW",
        });
        if (tripType === "ROUND_TRIP" && returnDate) {
          params.set("returnDate", returnDate);
        }

        const url = `/planning/airline/api/flights?${params.toString()}`;
        const res = await fetch(url);
        json = await res.json();
      }

      // 디버깅 로그
      console.log("📡 RAW 응답 전체:", json);
      console.log("📡 RAW 응답 data:", json?.data);

      // 정제
      const refined = normalizeFlightList(json?.data || []);
      console.log("✅ 정제된 데이터:", refined);
      setResults(refined);
    } catch (error) {
      console.error("검색 오류:", error);
      setResults([]);
    }
  };

  //TODO1 DB 받아오기
  /**
   * Schedule DB 받기
   * - scid가 존재하면 /planning/airline/api/schedule?scid=... 호출하여
   *   startDate, endDate를 설정 ✅
   */

  //TODO2 실제 유저의 입력을 받기
  /**
   * 출발 날짜, 도착 날짜, 출발 공항, 도착 공항,
   * - SearchForm에서 date input + tripType 추가 ✅
   */

  //TODO3 유저의 입력 값으로 API 호출 링크 만들기
  /**
   * 버튼 입력 값 추출하기
   * 해당 값 정제하여 링크 만들기
   * - handleSearch()에서 tripType 따라 GET/POST 분기 생성 ✅
   */

  //TODO4 API 호출한 뒤, 값 저장하고, 데이터 정제하기
  /**
   * API를 호출하고 결과 받기
   * API 결과를 정제해서 사용할 수 있는 값으로 바꾸기
   * - normalizeFlightList(json.data) 적용 완료 ✅
   */

  //TODO5 정제된 데이터 화면에 보여주기
  /**
   * 플라이트 카드 데이터 채우기
   * 카드 정렬 구현하기
   * - results 상태 값이 FlightCard에 전달됨 ✅
   */

  //TODO6 선택한 티켓 값 넘겨주기
  /**
   * 데이터 프롭스로 payment 화면에 넘겨주기
   * - FlightDetailModal을 통해 상세 정보 확인 구현됨 (결제 저장은 성공 후만) ✅
   */

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-20">
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
          // ✅ SearchForm 초기값 주입
          initialTripType="ROUND_TRIP"
          initialDepartureDate={startDate}
          initialReturnDate={endDate}
        />

        <SortOptions onChange={(sortType) => console.log("정렬:", sortType)} />

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
          onClose={() => setSelectedFlight(null)}
        />
      )}
    </div>
  );
}
