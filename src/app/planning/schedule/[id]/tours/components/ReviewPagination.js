'use client';

import { useState } from 'react';

export default function ReviewPagination({ reviews }) {
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedMap, setExpandedMap] = useState({});

	const itemsPerPage = 3;

	const totalPages = Math.ceil(reviews.length / itemsPerPage);

	const startIdx = (currentPage - 1) * itemsPerPage;
	const currentReviews = reviews.slice(startIdx, startIdx + itemsPerPage);

	const goPrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
	const goNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

	const toggleExpand = idx => {
		setExpandedMap(prev => ({
			...prev,
			[idx]: !prev[idx] // 해당 리뷰만 토글
		}));
	};

	return (
		<div className='max-w-md mx-auto'>
			{/* 리뷰 목록 */}
			<ul className='space-y-4'>
				{currentReviews.map((review, idx) => {
					const globalIndex = startIdx + idx;
					const text = `${review.originalText.text}`;
					const maxLength = 60;
					const expanded = expandedMap[globalIndex] || false;
					const isLong = text.length > maxLength;
					const displayText = expanded
						? text
						: text.slice(0, maxLength);
					console.log(review.rating);
					return (
						<li
							key={idx}
							className='p-4 border rounded-lg shadow-sm bg-white'>
							<p className='font-semibold'>
								{review.authorAttribution.displayName}
							</p>
							<p className='font-semibold'>{review.rating}</p>
							<div className='text-sm leading-relaxed'>
								<span>{displayText}</span>
								{/* 글이 길면 ...더보기 / 접기 버튼 표시 */}
								{isLong && (
									<button
										onClick={() =>
											toggleExpand(globalIndex)
										}
										className='text-blue-600 ml-1 hover:underline'>
										{expanded ? '접기' : '...더보기'}
									</button>
								)}
							</div>
							<p className='text-gray-700'>
								{review.relativePublishTimeDescription}
							</p>
						</li>
					);
				})}
			</ul>

			{/* 페이지네이션 버튼 */}
			<div className='flex justify-center gap-2 mt-4'>
				<button
					onClick={goPrev}
					disabled={currentPage === 1}
					className='px-3 py-1 rounded bg-gray-200 disabled:opacity-50'>
					이전
				</button>
				<span className='px-3 py-1'>
					{currentPage} / {totalPages}
				</span>
				<button
					onClick={goNext}
					disabled={currentPage === totalPages}
					className='px-3 py-1 rounded bg-gray-200 disabled:opacity-50'>
					다음
				</button>
			</div>
		</div>
	);
}
