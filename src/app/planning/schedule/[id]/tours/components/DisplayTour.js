'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CardList from './CardList';
import SortOptions from './Sort';

export default function DisplayTour({ details }) {
	const [sortedDetails, setSortedDetails] = useState([...details]);
	const [selectedTour, setSelectedTour] = useState([]);
	const [sortBy, setSortBy] = useState('rating'); // 정렬 기준
	const { id } = useParams();
	const router = useRouter();

	// details가 바뀌거나 sortBy가 바뀌면 정렬
	useEffect(() => {
		let sorted = [...details];
		if (sortBy === 'rating') {
			sorted.sort((a, b) => b.rating - a.rating);
		} else if (sortBy === 'reviewCount') {
			sorted.sort((a, b) => b.reviewCount - a.reviewCount);
		}
		setSortedDetails(sorted);
	}, [details, sortBy]);

	const handleConfirm = async () => {
		try {
			const res = await fetch('/api/tour', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(
					selectedTour.map(tour => ({ ...tour, schedulId: id }))
				)
			});

			if (!res.ok) throw new Error('일정 저장 실패');
			router.push(`/planning/schedule/${id}`);
		} catch (error) {
			if (error instanceof TypeError) {
				console.error('[네트워크 오류]', error.message);
				alert('네트워크 오류가 발생했습니다. 연결을 확인해주세요.');
			} else {
				console.error('[서버 오류]', error);
				alert(error.message);
			}
		}
	};

	return (
		<div className='px-4 py-3'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='font-semibold text-lg'>
					추천 관광지 {details.length}개
				</h2>
				<SortOptions sortBy={sortBy} setSortBy={setSortBy} />
			</div>
			<CardList
				sortedDetails={sortedDetails}
				setSelectedTour={setSelectedTour}
				selectedTour={selectedTour}
			/>
			{selectedTour.length !== 0 && (
				<div className='fixed bottom-[75px] left-0 right-0 flex justify-center z-50'>
					<button
						onClick={handleConfirm}
						className='bg-(--brandColor) text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-blue-600 transition'>
						{selectedTour.length}개 선택 완료
					</button>
				</div>
			)}
		</div>
	);
}
