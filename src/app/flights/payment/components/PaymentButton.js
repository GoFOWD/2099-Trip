"use client";
import { useRouter } from "next/navigation";

export default function PaymentButton({ enabled }) {
  const router = useRouter();

  const handlePayment = async () => {
    if (!enabled) return;
    // 모의 결제 로직 (1초 대기 후 성공 처리)
    try {
      await new Promise((res) => setTimeout(res, 1000));

      // ✅ 테스트용 결제 완료 페이지로 이동
      // 쿼리로 가격 정보 전달
      router.push("/flights/payment/success?status=success&price=900000");
    } catch (error) {
      // ❌ 실패 시 실패 페이지로 이동
      router.push("/payment/success?status=fail");
    }
  };
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t py-3 px-4 z-50">
      <button
        onClick={handlePayment}
        disabled={!enabled}
        className={`w-full py-3 font-bold rounded-lg transition ${
          enabled ? "btn_broad" : "btn_sub btn_disabled"
        }`}
      >
        {enabled ? "결제 진행하기" : "약관 동의 후 결제 가능"}
      </button>
    </div>
  );
}
