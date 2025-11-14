'use client';

import ImageCarousel from './ImageCarousel';
import ReviewPagination from './ReviewPagination';
import Image from 'next/image';

export default function DetailModal({ item, onClose }) {
	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-40 px-4'>
			<div className='bg-white w-full max-w-lg h-10/12 overflow-y-auto scrollbar-none rounded-lg relative shadow-lg'>
				<div className='relative flex justify-end'>
					<button
						onClick={onClose}
						className='fixed z-999 text-gray-200 hover:text-gray-700 mt-5 mr-5 bg-gray-800/70 rounded-full w-10 h-10'>
						✕
					</button>
				</div>
				<div>
					<div className='mb-4'>
						<ImageCarousel images={item.photoUrl} />
					</div>
					<div className='px-4 mb-4'>
						<h2 className='text-lg font-bold mb-2'>
							{item.placeName}
						</h2>
						<div className='flex gap-0.5 items-center'>
							<div className='w-2.5 h-3 relative'>
								<Image
									src='/navIcon/trip.svg'
									fill
									sizes='10px'
									className='object-contain'
									alt='주소'
								/>
							</div>
							<span className='text-sm text-[#4B5563]'>
								{item.addressKo}
							</span>
						</div>
					</div>
					<div className='px-4 mb-4'>
						<h3 className='font-semibold mb-1'>영업 시간</h3>
						{item.openingHours.map((h, i) => (
							<p key={i} className='text-sm text-[#4B5563]'>
								{h}
							</p>
						))}
					</div>
					<div className='px-4 mb-4'>
						<div className='flex gap-0.5'>
							<h3 className='font-semibold mb-1 mr-2'>리뷰</h3>
							<div className='flex gap-0.5 items-center mb-1'>
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
						<ReviewPagination reviews={item.reviews} />
					</div>
				</div>
				{/* 추가 컴포넌트/버튼 등 원하는 대로 커스텀 */}
			</div>
		</div>
	);
}
