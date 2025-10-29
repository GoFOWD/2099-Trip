import { useState } from "react";
import Header from "@/feature/common/Header";
import FooterNav from "@/feature/common/FooterNav";

import PaymentSummary from "./components/PaymentSummary";
import PassengerForm from "./components/PassengerForm";
import BaggageInsurance from "./components/BaggageInsurance";
import TermsAgreement from "./components/TermsAgreement";
import PaymentButton from "./components/PaymentButton";

import PassengerModal from "./modals/PassengerModal";
import BookingDetailModal from "./modals/BookingDetailModal";

const PaymentPage = () => {
  const [agreeAll, setAgreeAll] = useState(false);
  const [showPassenger, setShowPassenger] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const dummyBooking = {
    flight: {
      airline: "대한항공",
      flightNo: "KE123",
      departAirport: "ICN",
      arriveAirport: "NRT",
      departTime: "2025-10-01 08:30",
      arriveTime: "2025-10-01 10:45",
    },
    passengers: [
      { name: "홍길동", birth: "1990-05-12", gender: "M" },
      { name: "김민지", birth: "1992-07-03", gender: "F" },
    ],
    total: 900000,
  };

  return (
    <div className="sospack min-h-screen">
      <Header>
        <h1 className="text-lg font-semibold text-[var(--brandColor)]">
          결제 정보 입력
        </h1>
      </Header>

      <main className="max-w-3xl mx-auto p-4 space-y-6 pb-24">
        <PaymentSummary />
        <PassengerForm />
        <BaggageInsurance />
        <TermsAgreement onChange={setAgreeAll} />

        <div className="flex justify-end gap-2">
          <button onClick={() => setShowPassenger(true)} className="btn_sub">
            탑승객 수정
          </button>
          <button onClick={() => setShowBooking(true)} className="btn_broad">
            예약 내용 확인
          </button>
        </div>
      </main>

      <PaymentButton enabled={agreeAll} />
      <FooterNav />

      {showPassenger && (
        <PassengerModal onClose={() => setShowPassenger(false)} />
      )}
      {showBooking && (
        <BookingDetailModal
          onClose={() => setShowBooking(false)}
          booking={dummyBooking}
        />
      )}
    </div>
  );
};

export default PaymentPage;
