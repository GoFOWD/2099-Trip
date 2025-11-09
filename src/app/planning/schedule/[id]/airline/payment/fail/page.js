"use client";
import { useRouter } from "next/navigation";
import Header from "@/share/ui/Header";

export default function PaymentFailPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-4 pb-20">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-red-500">결제에 실패했습니다</h1>
        <p className="text-sm text-slate-500">
          네트워크 문제나 카드 한도 등의 이유로 결제가 완료되지 않았습니다.
        </p>

        <div className="space-y-2 w-full max-w-md mt-4">
          <button
            onClick={() => router.push("/planning/airline/payment")}
            className="btn_broad w-full"
          >
            다시 시도하기
          </button>
          <button
            onClick={() => router.push("/planning/airline")}
            className="btn_sub w-full"
          >
            항공권 목록으로 돌아가기
          </button>
        </div>
      </main>
    </div>
  );
}
