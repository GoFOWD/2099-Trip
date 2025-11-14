'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { keywordMap } from '../lib/keywordMap';
import DateSelectModal from './DateSelectModal ';

export default function ItemCard({ item, onClick, setSelectedTour }) {
	const [openDateModal, setOpenDateModal] = useState(false);
	const [isSelect, setIsSelect] = useState(false);
	const { id } = useParams();
	const router = useRouter();

	const keywords = item.keword;

	const keywordKo = keywords.map(keyword => {
		const keywordKo = keywordMap[keyword];
		return keywordKo;
	});

	const deletUndefined = keywordKo.filter(k => k !== undefined);

	const formattedKeword = deletUndefined.map(k => `#${k}`);

	// let userSchedules;
	// let schedule;
	// let startDate;
	// let endDate;

	const userSchedules = JSON.parse(localStorage.getItem('schedules'));
	const schedule = userSchedules.find(e => e.id === id);
	const sd = new Date(schedule.startDate);
	const ed = new Date(schedule.endDate);

	const startDate = sd.toISOString().split('T')[0];
	const endDate = ed.toISOString().split('T')[0];
	// useEffect(() => {
	// }, []);

	// 저장해야할 내용
	// 장소 이름
	// 날짜
	// 위도
	// 경도
	const latitude = item.Geo.latitude;
	const longitude = item.Geo.longitude;

	const handleSelectTour = date => {
		const tourInfo = {
			id: item.placeId,
			placeName: item.placeName,
			reservedAt: new Date(date),
			location: item.addressKo,
			latitude,
			longitude
		};
		setIsSelect(true);
		setSelectedTour(prev => [...prev, tourInfo]); // 클릭된 tour만 배열로 저장
		router.push(`/planning/schedule/${schedule.id}`);
	};

	const deleteTour = () => {
		setIsSelect(false);
		setSelectedTour(prev =>
			[...prev].filter(tour => tour.id !== item.placeId)
		);
	};

	return (
		<>
			<div
				className={
					isSelect
						? 'border-3 border-(--brandColor) rounded-lg shadow-md'
						: 'border border-[#F3F4F6] rounded-lg shadow-md'
				}>
				<div className='w-full h-48 relative'>
					<Image
						src={item.photoUrl[0]}
						fill
						sizes='100%'
						alt={`${item.placeName}`}
						className='object-cover rounded-t-lg'
					/>
				</div>
				<div className='flex flex-col gap-2 pt-3'>
					<div className='px-4'>
						<div className='flex gap-1'>
							<h3 className='font-semibold mb-4'>
								{item.placeName}
							</h3>
							<div className='flex gap-0.5 items-center mb-4'>
								<div className='w-3 h-3 relative flex items-center'>
									<Image
										src='/star.svg'
										fill
										sizes='12px'
										alt='평점'
										className='object-contain'
									/>
								</div>
								<span className='text-[#374151] text-sm'>
									{item.rating} {`(${item.reviewCount})`}
								</span>
							</div>
						</div>
						<p className='text-sm text-[#4B5563] mb-4'>
							{item.description}
						</p>
						<div className='flex gap-1 mb-2'>
							{formattedKeword.map((k, i) => (
								<p
									key={i}
									className='px-2 py-1 rounded-full bg-[#E2E1E1] text-[12px] text-[#4B5563]'>
									{k}
								</p>
							))}
						</div>
					</div>
					<div className='flex rounded-b-lg h-10 border-t border-t-[#E2E1E1]'>
						<button
							className='flex-1 rounded-bl-lg'
							onClick={onClick}>
							상세 보기
						</button>
						{isSelect ? (
							<button
								className='flex-1 bg-white text-red-500 rounded-br-lg'
								onClick={() => deleteTour()}>
								일정 취소
							</button>
						) : (
							<button
								className='flex-1 bg-(--brandColor) text-white rounded-br-lg'
								onClick={() => setOpenDateModal(true)}>
								일정 선택
							</button>
						)}
					</div>
				</div>
			</div>
			{openDateModal && (
				<DateSelectModal
					onClose={() => setOpenDateModal(false)}
					onSelect={date => handleSelectTour(date)}
					minDate={startDate}
					maxDate={endDate}
					setSelectedTour={setSelectedTour}
					item={item}
				/>
			)}
		</>
	);
}
