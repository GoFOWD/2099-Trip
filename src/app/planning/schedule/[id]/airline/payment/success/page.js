"use client";
import { useSearchParams, useRouter } from "next/navigation";
import ProgressBar from "@/share/ui/ProgressBar";
import Header from "@/share/ui/Header";

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const flight = {
    airline: "대한항공",
    flightNo: "KE123",
    departAirport: "ICN",
    arriveAirport: "NRT",
    departTime: "2025-10-01 08:30",
    arriveTime: "2025-10-01 10:45",
    seat: params.get("seat") || "일반석",
    price: Number(params.get("price") || 420000),
  };

  const budget = 800000; // 예시 예산
  const ratio = (flight.price / budget) * 100;
  const barColor =
    ratio > 100
      ? "bg-red-400"
      : ratio >= 80
      ? "bg-[var(--brandColor)]"
      : "bg-green-500";

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      <Header>
        <ProgressBar step={10} total={10} />
      </Header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-4 pb-20">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-[var(--brandColor)]">
          결제가 완료되었습니다!
        </h1>
        <p className="text-sm text-slate-500">
          예약이 성공적으로 완료되었습니다. 아래는 항공권 정보입니다.
        </p>

        {/* 항공권 정보 카드 */}
        <div className="bg-white rounded-[var(--radius-lg)] shadow-md p-4 text-sm w-full max-w-md space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">항공편</span>
            <span>
              {flight.airline} {flight.flightNo}
            </span>
          </div>
          <div className="flex justify-between">
            <span>노선</span>
            <span>
              {flight.departAirport} → {flight.arriveAirport}
            </span>
          </div>
          <div className="flex justify-between">
            <span>좌석 등급</span>
            <span>{flight.seat}</span>
          </div>
          <div className="flex justify-between">
            <span>출발 / 도착</span>
            <span>
              {flight.departTime} <br /> {flight.arriveTime}
            </span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>결제 금액</span>
            <span className="text-[var(--brandColor)]">
              {flight.price.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 예산 비교 프로그래스바 */}
        <div className="w-full max-w-md mt-3 text-left">
          <p className="text-sm mb-1 text-slate-600">
            예산 대비 사용률:{" "}
            <span className="font-semibold">{Math.round(ratio)}%</span>
          </p>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 ${barColor} transition-all`}
              style={{ width: `${Math.min(ratio, 100)}%` }}
            />
          </div>
          {ratio > 100 && (
            <p className="text-xs text-red-500 mt-1">⚠️ 예산을 초과했습니다.</p>
          )}
        </div>

        <button
          onClick={() => router.push("/planning/airline")}
          className="btn_broad w-full max-w-md mt-4"
        >
          다른 항공권 보러가기
        </button>
      </main>
    </div>
  );
}
