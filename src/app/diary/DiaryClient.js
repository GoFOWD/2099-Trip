'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function DiaryClient({ totalTrips, totalPhotos, totalCountries, trips, teamMint }) {

	return (
		<div className='min-h-screen bg-gray-50 pb-[65px]'>
			<div className='max-w-[700px] mx-auto bg-white'>
				{/* 헤더 */}
				<header className='sticky top-0 z-20 w-full bg-white border-b border-gray-200'>
					<div className='flex items-center justify-between px-4 py-3'>
						<h1 className='text-lg font-semibold'>여행 기록</h1>
						<button>
							<svg
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'>
								<circle cx='11' cy='11' r='8' />
								<path d='m21 21-4.35-4.35' />
							</svg>
						</button>
					</div>
				</header>

				{/* 나의 여행 기록 요약 */}
				<div
					className='px-4 py-6 mx-4 mt-4 rounded-xl'
					style={{ backgroundColor: teamMint }}>
					<h2 className='text-xl font-bold text-white mb-4'>나의 여행 기록</h2>
					<div className='flex justify-around'>
						<div className='text-center'>
							<div className='text-3xl font-bold text-white mb-1'>{totalTrips}</div>
							<div className='text-sm text-white opacity-90'>총 여행</div>
						</div>
						<div className='text-center'>
							<div className='text-3xl font-bold text-white mb-1'>{totalPhotos}</div>
							<div className='text-sm text-white opacity-90'>사진</div>
						</div>
						<div className='text-center'>
							<div className='text-3xl font-bold text-white mb-1'>{totalCountries}</div>
							<div className='text-sm text-white opacity-90'>국가</div>
						</div>
					</div>
				</div>

				{/* 여행 기록 목록 */}
				<div className='px-4 py-4 space-y-4'>
					{trips.length === 0 ? (
						<div className='text-center py-12 text-gray-500'>
							여행 기록이 없습니다
						</div>
					) : (
						trips.map(trip => (
							<Link
								key={trip.id}
								href={`/diary/${trip.id}`}
								className='block bg-white rounded-xl border border-gray-200 overflow-hidden relative'>
								{/* 상태 배지 */}
								<div className='absolute top-3 right-3 z-10'>
									{trip.status === 'in-progress' && (
										<span className='px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700'>
											진행 중
										</span>
									)}
									{trip.status === 'completed' && (
										<span className='px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600'>
											완료
										</span>
									)}
								</div>

								<div className='flex gap-4 p-4'>
									{/* 썸네일 이미지 */}
									<div className='w-24 h-24 shrink-0 relative rounded-lg overflow-hidden'>
										{trip.status === 'in-progress' && (
											<div className='absolute top-2 left-2 z-10 w-2 h-2 bg-green-500 rounded-full' />
										)}
										<Image
											src={trip.image}
											alt={trip.title}
											fill
											className='object-cover'
											onError={(e) => {
												e.target.src = 'https://via.placeholder.com/96x96?text=Travel';
											}}
										/>
									</div>

									{/* 정보 */}
									<div className='flex-1 min-w-0'>
										<h3 className='font-semibold text-gray-900 mb-1'>{trip.title}</h3>
										<div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
											<span>{trip.date}</span>
											<span>•</span>
											<span>{trip.days}일</span>
										</div>
										<div className='flex items-center gap-1 text-sm text-gray-600 mb-3'>
											<svg
												width='16'
												height='16'
												viewBox='0 0 24 24'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'>
												<path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z' />
												<circle cx='12' cy='13' r='4' />
											</svg>
											<span>{trip.photoCount}장</span>
										</div>

										{/* 태그 */}
										<div className='flex flex-wrap gap-2'>
											{trip.tags.map((tag, index) => (
												<span
													key={index}
													className='px-2 py-1 rounded-full text-xs font-medium border'
													style={{
														borderColor: teamMint,
														color: teamMint,
														backgroundColor: 'white'
													}}>
													{tag}
												</span>
											))}
										</div>
									</div>
								</div>
							</Link>
						))
					)}
				</div>
			</div>
		</div>
	);
}

