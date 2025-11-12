'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { shareToSNS } from '@/share/util/shareToSNS';

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
	const [showShareModal, setShowShareModal] = useState(false);
	const [showAddDiaryModal, setShowAddDiaryModal] = useState(false);

	// SNS 공유 핸들러
	const handleShare = async (platform) => {
		const shareData = {
			title: `${title} 여행 기록`,
			text: `${startDate} - ${endDate} (${days}일) 여행 기록을 공유합니다.`,
			url: typeof window !== 'undefined' ? window.location.href : '',
			imageUrl: '' // 필요시 추가
		};

		// 'web' 플랫폼인 경우
		if (platform === 'web') {
			// 모바일에서 Web Share API 시도
			if (navigator.share) {
				try {
					await navigator.share({
						title: shareData.title,
						text: shareData.text,
						url: shareData.url
					});
					return; // 공유 성공
				} catch (error) {
					// 사용자가 취소한 경우는 무시
					if (error.name !== 'AbortError') {
						console.error('공유 실패:', error);
					}
					return;
				}
			}
			// Web Share API를 지원하지 않으면 모달 표시
			setShowShareModal(true);
			return;
		}

		// 다른 플랫폼 (kakao, facebook, twitter, copy)
		const result = await shareToSNS(shareData, platform);
		
		if (result.success) {
			setShowShareModal(false);
			if (platform === 'copy') {
				alert('링크가 복사되었습니다!');
			}
		}
	};

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
						onClick={() => setShowAddDiaryModal(true)}
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
						<button 
							onClick={() => handleShare('web')}
							className='flex-1 py-3 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-center gap-2'>
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

				{/* SNS 공유 모달 */}
				{showShareModal && (
					<div 
						className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center'
						onClick={() => setShowShareModal(false)}>
						<div 
							className='bg-white rounded-t-2xl w-full max-w-[700px] p-6'
							onClick={(e) => e.stopPropagation()}>
							<h3 className='text-lg font-semibold mb-4'>공유하기</h3>
							<div className='grid grid-cols-3 gap-4'>
								{/* 카카오톡 */}
								<button
									onClick={() => handleShare('kakao')}
									className='flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors'>
									<div className='w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center'>
										<span className='text-xl'>💬</span>
									</div>
									<span className='text-xs font-medium'>카카오톡</span>
								</button>

								{/* 페이스북 */}
								<button
									onClick={() => handleShare('facebook')}
									className='flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors'>
									<div className='w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center'>
										<span className='text-white text-xl font-bold'>f</span>
									</div>
									<span className='text-xs font-medium'>페이스북</span>
								</button>

								{/* 트위터 */}
								<button
									onClick={() => handleShare('twitter')}
									className='flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors'>
									<div className='w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center'>
										<svg width='24' height='24' viewBox='0 0 24 24' fill='white'>
											<path d='M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' />
										</svg>
									</div>
									<span className='text-xs font-medium'>트위터</span>
								</button>

								{/* 링크 복사 */}
								<button
									onClick={() => handleShare('copy')}
									className='flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors col-span-3'>
									<div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center'>
										<svg
											width='24'
											height='24'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'>
											<path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' />
											<path d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' />
										</svg>
									</div>
									<span className='text-xs font-medium'>링크 복사</span>
								</button>
							</div>
							<button
								onClick={() => setShowShareModal(false)}
								className='w-full mt-4 py-3 rounded-lg text-sm font-medium border border-gray-300'>
								취소
							</button>
						</div>
					</div>
				)}

				{/* 새 기록 추가 모달 */}
				{showAddDiaryModal && (
					<AddDiaryModal
						scheduleId={scheduleId}
						onClose={() => setShowAddDiaryModal(false)}
						onAdd={() => {
							setShowAddDiaryModal(false);
							router.refresh(); // 페이지 새로고침하여 새 기록 표시
						}}
						teamMint={teamMint}
					/>
				)}
			</div>
		</div>
	);
}

// 새 기록 추가 모달 컴포넌트
function AddDiaryModal({ scheduleId, onClose, onAdd, teamMint }) {
	const [content, setContent] = useState('');
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
	const [title, setTitle] = useState('');

	// 제출 핸들러
	const handleSubmit = async () => {
		try {
			// 다이어리 생성
			const response = await fetch('/api/diary', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: title || '기록',
					content: content,
					date: date
				})
			});

			if (!response.ok) {
				throw new Error('다이어리 저장 실패');
			}

			alert('기록이 추가되었습니다!');
			onAdd();
		} catch (error) {
			console.error('다이어리 저장 오류:', error);
			alert('기록 저장에 실패했습니다. 다시 시도해주세요.');
		}
	};

	return (
		<div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center'>
			<div className='bg-white rounded-t-2xl w-full max-w-[700px] max-h-[90vh] flex flex-col'>
				{/* 모달 헤더 */}
				<div className='flex items-center justify-between p-4 border-b'>
					<h2 className='text-lg font-semibold'>새 기록 추가</h2>
					<button
						onClick={onClose}
						className='p-2 hover:bg-gray-100 rounded-full'>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'>
							<line x1='18' y1='6' x2='6' y2='18' />
							<line x1='6' y1='6' x2='18' y2='18' />
						</svg>
					</button>
				</div>

				{/* 모달 내용 */}
				<div className='flex-1 overflow-y-auto p-4 space-y-4'>
					{/* 제목 */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							제목
						</label>
						<input
							type='text'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder='제목을 입력하세요'
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50B4BE]'
						/>
					</div>

					{/* 날짜 */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							날짜
						</label>
						<input
							type='date'
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50B4BE]'
						/>
					</div>

					{/* 메모 */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							메모
						</label>
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder='메모를 입력하세요'
							rows={4}
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50B4BE]'
						/>
					</div>
				</div>

				{/* 모달 하단 버튼 */}
				<div className='p-4 border-t flex gap-2'>
					<button
						onClick={onClose}
						className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50'>
						취소
					</button>
					<button
						onClick={handleSubmit}
						className='flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white'
						style={{ backgroundColor: teamMint }}>
						추가하기
					</button>
				</div>
			</div>
		</div>
	);
}

