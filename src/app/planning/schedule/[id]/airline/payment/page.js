'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import Header from '@/share/ui/Header';

import PaymentSummary from './components/PaymentSummary';
import PassengerForm from './components/PassengerForm';
import BaggageInsurance from './components/BaggageInsurance';
import TermsAgreement from './components/TermsAgreement';
import PaymentButton from './components/PaymentButton';

import PassengerModal from './modals/PassengerModal';
import BookingDetailModal from './modals/BookingDetailModal';

export default function PaymentPage({ params }) {
	const { id: scheduleId } = params; // ⭐ URL에서 scheduleId 받기
	const searchParams = useSearchParams();

	// URL에서 쿼리 파라미터 받기
	const flightId = searchParams.get('flightId');
	const seat = searchParams.get('seat') || '일반석';
	const price = Number(searchParams.get('price') || 0);

	const [agreeAll, setAgreeAll] = useState(false);
	const [showPassenger, setShowPassenger] = useState(false);
	const [showBooking, setShowBooking] = useState(false);

	// TODO: 실제 DB에서 불러올 항공권/탑승객 정보
	const dummyBooking = {
		flight: {
			airline: '대한항공',
			flightNo: 'KE123',
			departAirport: 'ICN',
			arriveAirport: 'NRT',
			departTime: '2025-10-01 08:30',
			arriveTime: '2025-10-01 10:45'
		},
		passengers: [
			{ name: '홍길동', birth: '1990-05-12', gender: 'M' },
			{ name: '김민지', birth: '1992-07-03', gender: 'F' }
		],
		total: price || 0
	};

	return (
		<div className='sospack min-h-screen'>
			<Header>
				<div className='flex justify-end'>
					<button
						onClick={() => setShowBooking(true)}
						className='btn_broad'>
						예약 내용 확인
					</button>
				</div>
				<h1 className='text-lg font-semibold text-[var(--brandColor)]'>
					결제 정보 입력
				</h1>
			</Header>

			<main className='w-full max-w-md mx-auto px-1 pt-1 space-y-1 pb-20'>
				{/* 결제 요약 */}
				<PaymentSummary
					flight={{ flightId }}
					seat={seat}
					price={price}
				/>

				{/* 탑승객 정보 */}
				<PassengerForm />

				{/* <div className="flex justify-center">
          <button onClick={() => setShowPassenger(true)} className="btn_sub">
            탑승객 수정
          </button>
        </div> */}

				{/* 수하물/보험 */}
				<BaggageInsurance />

				{/* 약관 */}
				<TermsAgreement onChange={setAgreeAll} />

				{/* 결제 버튼 */}
				<PaymentButton enabled={agreeAll} />
			</main>

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
}
