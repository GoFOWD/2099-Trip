"use client";
import { useRouter } from "next/navigation";

export default function PaymentButton({ enabled }) {
  const router = useRouter();

  const handleClick = () => {
    if (!enabled) return;

    // ✅ 임시: 결제 성공/실패 랜덤 처리 (테스트용)
    const success = Math.random() > 0.3; // 70% 확률로 성공
    if (success) {
      router.push("/planning/airline/payment/success?seat=일반석&price=420000");
    } else {
      router.push("/planning/airline/payment/fail");
    }
  };

  return (
    <div className="left-0 right-0 bg-white border-t p-3">
      <button
        onClick={handleClick}
        disabled={!enabled}
        className={`btn_broad w-full ${
          !enabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        결제 진행하기
      </button>
    </div>
  );
}
