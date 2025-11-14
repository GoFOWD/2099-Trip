'use client';
import React from 'react';

export default function SortOptions({ sortBy, setSortBy }) {
	return (
		<div className='p-2'>
			<select
				value={sortBy}
				onChange={e => setSortBy(e.target.value)}
				className='bg-[#E2E1E1] rounded-lg p-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500'>
				<option value='rating'>평점순</option>
				<option value='reviewCount'>리뷰 많은순</option>
			</select>
		</div>
	);
}
