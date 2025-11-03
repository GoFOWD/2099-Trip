'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/share/ui/Header';
import FooterNav from '@/share/ui/FooterNav';

import PaymentSummary from './components/PaymentSummary';
import PassengerForm from './components/PassengerForm';
import BaggageInsurance from './components/BaggageInsurance';
import TermsAgreement from './components/TermsAgreement';
import PaymentButton from './components/PaymentButton';

import PassengerModal from './modals/PassengerModal';
import BookingDetailModal from './modals/BookingDetailModal';

export default function PaymentPage() {
	const params = useSearchParams();
	const flightId = params.get('flightId');
	const seatType = params.get('seat');
	const price = params.get('price');

	const [agreeAll, setAgreeAll] = useState(false);
	const [showPassenger, setShowPassenger] = useState(false);
	const [showBooking, setShowBooking] = useState(false);

	// 실제라면 flightId를 이용해 API 요청 (예: /api/flights/[id])
	const [flight, setFlight] = useState(null);

	useEffect(() => {
		// 🔹 임시 더미 데이터
		setFlight({
			id: flightId,
			airline: '대한항공',
			flightNo: 'KE123',
			departAirport: 'ICN',
			arriveAirport: 'NRT',
			departTime: '2025-10-01 08:30',
			arriveTime: '2025-10-01 10:45',
			seatType,
			price: parseInt(price, 10)
		});
	}, [flightId, seatType, price]);

	const dummyBooking = {
		flight,
		passengers: [
			{ name: '홍길동', birth: '1990-05-12', gender: 'M' },
			{ name: '김민지', birth: '1992-07-03', gender: 'F' }
		],
		total: flight ? flight.price * 2 : 0
	};

	if (!flight) return null;

	return (
		<div className='sospack min-h-screen'>
			<Header>
				<h1 className='text-lg font-semibold text-[var(--brandColor)]'>
					결제 정보 입력
				</h1>
			</Header>

			<main className='max-w-3xl mx-auto p-4 space-y-6 pb-24'>
				<PaymentSummary flight={flight} />
				<PassengerForm />
				<BaggageInsurance />
				<TermsAgreement onChange={setAgreeAll} />

				<div className='flex justify-end gap-2'>
					<button
						onClick={() => setShowPassenger(true)}
						className='btn_sub'>
						탑승객 수정
					</button>
					<button
						onClick={() => setShowBooking(true)}
						className='btn_broad'>
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
}
