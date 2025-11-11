'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function DiaryDetailClient({
	scheduleId,
	title,
	startDate,
	endDate,
	days,
	photoCount,
	diariesByDate,
	teamMint
}) {
	const router = useRouter();

	// 날짜별로 정렬된 키 배열
	const sortedDates = Object.keys(diariesByDate).sort();

	// 날짜 포맷팅 함수 (12월 15일 형식)
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${month}월 ${day}일`;
	};

	// 시간 추출 함수 (다이어리 title에서 시간 추출)
	const extractTime = (title) => {
		// "나리타 공항 14:00" 형식에서 시간 추출
		const timeMatch = title.match(/(\d{1,2}):(\d{2})/);
		if (timeMatch) {
			return timeMatch[0];
		}
		return '';
	};

	// 장소명 추출 함수
	const extractPlace = (title) => {
		// 시간 부분 제거
		return title.replace(/\s+\d{1,2}:\d{2}$/, '');
	};

	return (
		<div className='min-h-screen bg-gray-50 pb-[180px]'>
			<div className='max-w-[700px] mx-auto bg-white'>
				{/* 헤더 */}
				<header className='sticky top-0 z-20 w-full bg-white border-b border-gray-200'>
					<div className='flex items-center justify-between px-4 py-3'>
						<button onClick={() => router.back()}>
							<svg
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'>
								<path d='M19 12H5M12 19l-7-7 7-7' />
							</svg>
						</button>
						<h1 className='text-lg font-semibold'>{title} 여행 기록</h1>
						<button>
							<svg
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'>
								<circle cx='18' cy='5' r='3' />
								<circle cx='6' cy='12' r='3' />
								<circle cx='18' cy='19' r='3' />
								<line x1='8.59' y1='13.51' x2='15.42' y2='17.49' />
								<line x1='15.41' y1='6.51' x2='8.59' y2='10.49' />
							</svg>
						</button>
					</div>
				</header>

				{/* 여행 요약 카드 */}
				<div
					className='mx-4 mt-4 p-4 rounded-xl'
					style={{ backgroundColor: teamMint }}>
					<div className='flex items-start justify-between'>
						<div className='flex-1'>
							<h2 className='text-xl font-bold text-white mb-2'>{title} 여행</h2>
							<div className='text-sm text-white opacity-90 mb-1'>
								{startDate} - {endDate} ({days}일)
							</div>
							<div className='text-sm text-white opacity-90'>
								{photoCount}장의 사진
							</div>
						</div>
						<div className='w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center'>
							<svg
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='white'
								strokeWidth='2'>
								<path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z' />
								<circle cx='12' cy='13' r='4' />
							</svg>
						</div>
					</div>
				</div>

				{/* 날짜별 기록 목록 */}
				{sortedDates.length === 0 ? (
					<div className='flex items-center justify-center min-h-[60vh] text-gray-500'>
						<div className='text-center'>
							아직 기록이 없습니다
						</div>
					</div>
				) : (
					<div className='px-4 py-4 space-y-6'>
						{sortedDates.map(dateKey => (
							<div key={dateKey}>
								{/* 날짜 헤더 */}
								<h3 className='text-lg font-semibold text-gray-900 mb-4'>
									{formatDate(dateKey)}
								</h3>

								{/* 해당 날짜의 기록들 */}
								<div className='space-y-4'>
									{diariesByDate[dateKey].map(diary => {
										const place = extractPlace(diary.title);
										const time = extractTime(diary.title);

										return (
											<div key={diary.id} className='flex gap-3'>
												{/* 위치 아이콘 */}
												<div className='flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center'
													style={{ backgroundColor: `${teamMint}20` }}>
													<svg
														width='20'
														height='20'
														viewBox='0 0 24 24'
														fill='none'
														stroke={teamMint}
														strokeWidth='2'>
														<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
														<circle cx='12' cy='10' r='3' />
													</svg>
												</div>

												{/* 기록 내용 */}
												<div className='flex-1'>
													<div className='font-medium text-gray-900 mb-2'>
														{place} {time && <span className='text-gray-600'>{time}</span>}
													</div>

													{/* 사진 */}
													{diary.pic && (
														<div className='mb-2'>
															{diary.pic.includes(',') ? (
																<div className='flex gap-2'>
																	{diary.pic.split(',').slice(0, 2).map((pic, idx) => (
																		<div key={idx} className='w-24 h-24 relative rounded-lg overflow-hidden'>
																			<Image
																				src={pic.trim()}
																				alt={place}
																				fill
																				className='object-cover'
																				onError={(e) => {
																					e.target.src = 'https://via.placeholder.com/96x96?text=Photo';
																				}}
																			/>
																		</div>
																	))}
																</div>
															) : (
																<div className='w-24 h-24 relative rounded-lg overflow-hidden'>
																	<Image
																		src={diary.pic}
																		alt={place}
																		fill
																		className='object-cover'
																		onError={(e) => {
																			e.target.src = 'https://via.placeholder.com/96x96?text=Photo';
																		}}
																	/>
																</div>
															)}
														</div>
													)}

													{/* 설명 */}
													{diary.content && (
														<p className='text-sm text-gray-700 leading-relaxed'>
															{diary.content}
														</p>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						))}
					</div>
				)}

				{/* 하단 버튼들 - 하단바 바로 위에 고정 */}
				<div className='fixed bottom-[65px] left-0 right-0 max-w-[700px] mx-auto px-4 py-4 space-y-3 z-10'>
					{/* 새 기록 추가하기 */}
					<button
						className='w-full py-3 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2'
						style={{ backgroundColor: teamMint }}>
						<svg
							width='20'
							height='20'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'>
							<line x1='12' y1='5' x2='12' y2='19' />
							<line x1='5' y1='12' x2='19' y2='12' />
						</svg>
						새 기록 추가하기
					</button>

					{/* SNS 공유, 앨범 만들기 */}
					<div className='flex gap-2'>
						<button className='flex-1 py-3 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-center gap-2'>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'>
								<circle cx='18' cy='5' r='3' />
								<circle cx='6' cy='12' r='3' />
								<circle cx='18' cy='19' r='3' />
								<line x1='8.59' y1='13.51' x2='15.42' y2='17.49' />
								<line x1='15.41' y1='6.51' x2='8.59' y2='10.49' />
							</svg>
							SNS 공유
						</button>
						<button className='flex-1 py-3 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-center gap-2'>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'>
								<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
								<polyline points='7 10 12 15 17 10' />
								<line x1='12' y1='15' x2='12' y2='3' />
							</svg>
							앨범 만들기
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

