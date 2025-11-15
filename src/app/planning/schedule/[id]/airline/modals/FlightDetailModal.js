'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BaseModal from '@/share/ui/BaseModal';
import { apicodeToName } from '../data/airports';

export default function FlightDetailModal({ flight, scheduleId, onClose }) {
	const router = useRouter();
	const [selectedSeat, setSelectedSeat] = useState(null);

	const seats = flight.seats || [
		{ type: '일반석', price: flight.price },
		{ type: '프리미엄', price: flight.price + 80000 },
		{ type: '비즈니스', price: flight.price + 180000 }
	];

	const handlePayment = async () => {
		if (!selectedSeat) return alert('좌석 등급을 선택하세요!');
		if (!scheduleId) return alert('scheduleId 누락 - URL 오류!');

		try {
			const res = await fetch('/api/airline/ticket', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					price: selectedSeat.price,
					airline: flight.airline,
					tripType: flight.tripType || 'ROUND_TRIP',
					scheduleId,
					segments: flight.segments || []
				})
			});

			const json = await res.json();

			if (!res.ok) {
				console.error('❌ API ERROR:', json);
				throw new Error(json.error || '티켓 생성 실패');
			}

			console.log('🎉 AirTicket 생성 완료:', json.ticket);

			router.push(
				`/planning/schedule/${scheduleId}/airline/payment?flightId=${json.ticket.id}&seat=${selectedSeat.type}&price=${selectedSeat.price}`
			);
		} catch (err) {
			console.error('❌ handlePayment Error:', err);
			alert('항공권 정보를 저장하는 중 오류가 발생했습니다.');
		}
	};
	const type = ['출국', '귀국'];
	return (
		<BaseModal title='항공편 상세' onClose={onClose}>
			<div className='space-y-4 text-sm mb-3'>
				<div className='font-semibold text-[var(--brandColor)]'>
					{flight.airline} {flight.flightNo}
				</div>

				<div className='text-xs text-slate-500'>
					총 {flight.segments?.length || 1}회 탑승
				</div>

				<hr className='my-2' />

				{flight.segments?.map((seg, idx) => {
					const DairportNameObj = apicodeToName.find(
						e => e.code === seg.departurePort
					);
					const AairportNameObj = apicodeToName.find(
						e => e.code === seg.arrivalPort
					);

					const DPort = DairportNameObj.name;
					const APort = AairportNameObj.name;

					return (
						<div
							key={seg.id || idx}
							className='border rounded-lg p-3 bg-slate-50 space-y-1'>
							<div className='font-semibold text-[var(--brandColor)]'>
								{type[idx]}
							</div>

							<div className='text-xs'>
								항공편 번호: {seg.flightNumber}
							</div>

							<div className='text-sm font-semibold mt-1'>
								탑승 날짜: {seg.departureDate}
							</div>

							<div className='text-xs text-slate-600'>
								출발: {seg.departureDate} {seg.departureTime}
								<br />
								공항: {DPort}
							</div>

							<div className='text-xs text-slate-600'>
								도착: {seg.arrivalDate} {seg.arrivalTime}
								<br />
								공항: {APort}
							</div>
						</div>
					);
				})}

				<hr className='my-3' />
			</div>

			<div className='space-y-2'>
				<h3 className='text-sm font-semibold text-slate-700 mb-1'>
					좌석 선택
				</h3>

				<div className='grid grid-cols-1 gap-1'>
					{seats.map((seat, idx) => (
						<button
							key={idx}
							onClick={() => setSelectedSeat(seat)}
							className={`p-3 rounded-lg border text-sm flex justify-between items-center transition ${
								selectedSeat?.type === seat.type
									? 'bg-[var(--brandColor)] text-white border-[var(--brandColor)]'
									: 'bg-white text-slate-700 border-slate-200'
							}`}>
							<span>{seat.type}</span>
							<span>{seat.price.toLocaleString()}원</span>
						</button>
					))}
				</div>
			</div>

			<div className='border-t mt-4 pt-4 flex justify-end gap-3'>
				<button onClick={onClose} className='btn_sub'>
					닫기
				</button>
				<button onClick={handlePayment} className='btn_broad'>
					결제하기
				</button>
			</div>
		</BaseModal>
	);
}
