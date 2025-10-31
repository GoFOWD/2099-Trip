"use client";
import Header from "@/feature/common/Header";
import ProgressBar from "@/feature/common/ProgressBar";
import TravelCard from "@/app/flights/components/TravelCard";
import FooterNav from "@/feature/common/FooterNav";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "success";
  const budget = 800000;
  const paid = Number(searchParams.get("price")) || 900000;

  // 💰 예산 대비 비율 (퍼센트)
  const ratio = (paid / budget) * 100;

  // 색상 설정 로직
  let barColor = "#22c55e"; // 기본: 초록색
  if (ratio > 100) barColor = "#ef4444"; // 예산 초과 → 붉은색
  else if (ratio > 80) barColor = "#2BB3A3"; // 80~100% → 민트색

  // 예시 항공권 데이터
  const flight = {
    airline: "대한항공",
    flightNo: "KE123",
    departAirport: "ICN 인천공항 T2",
    arriveAirport: "NRT 나리타공항 T1",
    departTime: "2025-10-01 08:30",
    arriveTime: "2025-10-01 10:45",
    seat: "일반석 (Economy)",
    gate: "A12",
    terminal: "T2",
  };

  const passengers = [
    { name: "홍길동", gender: "M", birth: "1990-05-12" },
    { name: "김민지", gender: "F", birth: "1992-07-03" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] pb-24">
      <Header>
        <ProgressBar step={6} total={10} />
        <TravelCard
          destination="파리, 프랑스"
          startDate="2025-10-01"
          endDate="2025-10-09"
          budget="80만원"
        />
      </Header>

      <main className="max-w-3xl mx-auto p-4 space-y-6 text-center">
        {status === "success" ? (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-[var(--brandColor)] mb-1">
              결제가 완료되었습니다!
            </h1>
            <p className="text-slate-600">
              항공권 예약이 정상적으로 처리되었습니다.
            </p>

            {/* ✈️ 항공편 정보 */}
            <section className="card text-left">
              <h2 className="font-semibold text-[var(--brandColor)] mb-2 text-sm">
                항공편 정보
              </h2>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>항공사:</strong> {flight.airline} ({flight.flightNo})
                </p>
                <p>
                  <strong>출발:</strong> {flight.departAirport} (
                  {flight.departTime})
                </p>
                <p>
                  <strong>도착:</strong> {flight.arriveAirport} (
                  {flight.arriveTime})
                </p>
                <p>
                  <strong>좌석:</strong> {flight.seat}
                </p>
                <p>
                  <strong>터미널 / 게이트:</strong> {flight.terminal} /{" "}
                  {flight.gate}
                </p>
              </div>
            </section>

            {/* 👥 탑승객 정보 */}
            <section className="card text-left">
              <h2 className="font-semibold text-[var(--brandColor)] mb-2 text-sm">
                탑승객 정보
              </h2>
              <ul className="text-sm space-y-1">
                {passengers.map((p, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{p.name}</span>
                    <span className="text-slate-500">
                      {p.gender === "M" ? "남" : "여"} ({p.birth})
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 💰 예산 비교 (ProgressBar) */}
            <section className="card text-left">
              <h2 className="font-semibold text-[var(--brandColor)] mb-2 text-sm">
                예산 대비 결제 금액
              </h2>
              <div className="text-sm mb-1 flex justify-between">
                <span>예산: {budget.toLocaleString()}원</span>
                <span>결제: {paid.toLocaleString()}원</span>
              </div>

              {/* 프로그래스바 */}
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(ratio, 100)}%`,
                    background: barColor,
                  }}
                ></div>
              </div>

              <p className="mt-2 text-right text-xs text-slate-500">
                {ratio.toFixed(1)}% 사용됨
              </p>
            </section>

            {/* 버튼 */}
            <div className="space-y-2">
              <button className="btn_broad w-full">호텔 예약</button>
            </div>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-500">
              결제에 실패했습니다
            </h1>
            <p className="text-slate-600 mb-6">잠시 후 다시 시도해주세요.</p>
            <button className="btn_broad w-full">다시 결제 시도</button>
          </>
        )}
      </main>

      <FooterNav />
    </div>
  );
}
