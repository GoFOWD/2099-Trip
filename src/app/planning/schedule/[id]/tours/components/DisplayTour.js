'use client';

import { useState, useEffect } from 'react';
import CardList from './CardList';
import SortOptions from './Sort';

export default function DisplayTour({ details }) {
	const [sortedDetails, setSortedDetails] = useState([...details]);
	const [selectedTour, setSelectedTour] = useState([]);
	const [sortBy, setSortBy] = useState('rating'); // 정렬 기준

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
			/>
		</div>
	);
}
