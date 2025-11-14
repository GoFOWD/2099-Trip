'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
	const [selectedDateForModal, setSelectedDateForModal] = useState(null); // 모달에 전달할 날짜
	const [selectedImage, setSelectedImage] = useState(null); // 확대할 이미지

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

	// 여행 기간의 모든 날짜 생성
	const getAllDatesInRange = () => {
		const dates = [];
		const start = new Date(startDate);
		const end = new Date(endDate);
		
		// 날짜 문자열을 Date 객체로 변환
		const [startYear, startMonth, startDay] = startDate.split('.').map(Number);
		const [endYear, endMonth, endDay] = endDate.split('.').map(Number);
		
		const startDateObj = new Date(startYear, startMonth - 1, startDay);
		const endDateObj = new Date(endYear, endMonth - 1, endDay);
		
		const currentDate = new Date(startDateObj);
		while (currentDate <= endDateObj) {
			const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
			dates.push(dateKey);
			currentDate.setDate(currentDate.getDate() + 1);
		}
		
		return dates;
	};

	const allDates = getAllDatesInRange();

	// 날짜 포맷팅 함수 (12월 15일 형식)
	const formatDate = (dateString) => {
		// "YYYY-MM-DD" 형식 파싱
		const [year, month, day] = dateString.split('-').map(Number);
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
				<header className='sticky top-0 z-30 w-full bg-white border-b border-gray-200'>
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

				{/* 여행 요약 카드 - 고정 */}
				<div
					className='sticky top-[57px] z-20 mx-4 mt-4 p-4 rounded-xl'
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

				{/* 날짜별 갤러리 - 여행 기간의 모든 날짜 표시 */}
				<div className='px-4 py-4 space-y-8 pb-8'>
					{allDates.map(dateKey => {
						// 해당 날짜의 사진이 있는 다이어리만 필터링하고 시간순 정렬
						const diariesForDate = diariesByDate[dateKey] || [];
						const diariesWithPhotos = diariesForDate
							.filter(diary => diary.pic)
							.sort((a, b) => {
								// 시간 추출하여 정렬
								const timeA = extractTime(a.title) || '';
								const timeB = extractTime(b.title) || '';
								return timeA.localeCompare(timeB);
							});

						return (
							<div key={dateKey} className='space-y-4'>
								{/* 날짜 헤더 */}
								<h3 className='text-lg font-semibold text-gray-900 mb-4'>
									{formatDate(dateKey)}
								</h3>

								{/* 다이어리 그리드 - 가로로 여러 장 배치 */}
								{diariesWithPhotos.length > 0 ? (
									<div className='grid grid-cols-3 gap-2'>
										{diariesWithPhotos.map((diary) => {
											const place = extractPlace(diary.title);
											const time = extractTime(diary.title);
											
											return (
												<div key={diary.id} className='space-y-1'>
													{/* 사진 */}
													<div 
														className='relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity'
														onClick={() => setSelectedImage({ src: diary.pic, place, time, content: diary.content })}
													>
														<Image
															src={diary.pic}
															alt={place || '사진'}
															fill
															className='object-cover'
															sizes='(max-width: 700px) 33vw, 200px'
															onError={(e) => {
																e.target.onerror = null;
																e.target.src = 'https://via.placeholder.com/200x200?text=Photo';
															}}
														/>
													</div>

													{/* 장소명과 시간 (작게) */}
													<div className='flex items-center gap-1'>
														<svg
															width='12'
															height='12'
															viewBox='0 0 24 24'
															fill='none'
															stroke='currentColor'
															strokeWidth='2'
															style={{ color: teamMint }}>
															<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
															<circle cx='12' cy='10' r='3' />
														</svg>
														<span className='text-xs font-medium text-gray-900 truncate'>
															{place}
														</span>
													</div>
													{time && (
														<p className='text-xs text-gray-600'>{time}</p>
													)}

													{/* 메모 (텍스트 버블) - 작게 */}
													{diary.content && (
														<div className='bg-gray-100 rounded px-2 py-1.5'>
															<p className='text-xs text-gray-700 whitespace-pre-wrap line-clamp-2'>
																{diary.content}
															</p>
														</div>
													)}
												</div>
											);
										})}
									</div>
								) : (
									/* 사진이 없는 날짜 - 빈 공간 표시 */
									<div className='grid grid-cols-3 gap-2'>
										<div 
											className='relative w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors'
											onClick={() => {
												setSelectedDateForModal(dateKey);
												setShowAddDiaryModal(true);
											}}
										>
											<svg
												width='24'
												height='24'
												viewBox='0 0 24 24'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'
												className='text-gray-400'>
												<line x1='12' y1='5' x2='12' y2='19' />
												<line x1='5' y1='12' x2='19' y2='12' />
											</svg>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>

				{/* 하단 버튼 박스 - 하단바 바로 위에 고정 */}
				<div className='fixed bottom-[65px] left-0 right-0 z-50'>
					<div className='max-w-[700px] mx-auto px-4 py-4 bg-white'>
						{/* SNS 공유, 앨범 만들기 */}
						<div className='flex gap-2'>
							<button 
								onClick={() => handleShare('web')}
								className='flex-1 py-3 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-center gap-2 bg-white hover:bg-gray-50'>
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
							<button className='flex-1 py-3 rounded-lg text-sm font-medium border border-gray-300 flex items-center justify-center gap-2 bg-white hover:bg-gray-50'>
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
						onClose={() => {
							setShowAddDiaryModal(false);
							setSelectedDateForModal(null);
						}}
						onAdd={() => {
							setShowAddDiaryModal(false);
							setSelectedDateForModal(null);
							router.refresh(); // 페이지 새로고침하여 새 기록 표시
						}}
						teamMint={teamMint}
						initialDate={selectedDateForModal}
					/>
				)}

				{/* 이미지 확대 모달 */}
				{selectedImage && (
					<div 
						className='fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4'
						onClick={() => setSelectedImage(null)}
					>
						<div className='relative w-full max-w-4xl max-h-[90vh] flex flex-col'>
							{/* 닫기 버튼 */}
							<button
								onClick={() => setSelectedImage(null)}
								className='absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors'
							>
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

							{/* 이미지 정보 */}
							{(selectedImage.place || selectedImage.time) && (
								<div className='mb-4 text-white'>
									{selectedImage.place && (
										<div className='flex items-center gap-2 mb-1'>
											<svg
												width='16'
												height='16'
												viewBox='0 0 24 24'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'
												style={{ color: teamMint }}>
												<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
												<circle cx='12' cy='10' r='3' />
											</svg>
											<span className='text-sm font-medium'>{selectedImage.place}</span>
											{selectedImage.time && (
												<span className='text-sm text-gray-300'>{selectedImage.time}</span>
											)}
										</div>
									)}
								</div>
							)}

							{/* 확대된 이미지 */}
							<div className='relative w-full flex-1 flex items-center justify-center'>
								<Image
									src={selectedImage.src}
									alt={selectedImage.place || '사진'}
									width={1200}
									height={1200}
									className='max-w-full max-h-[80vh] object-contain rounded-lg'
									onClick={(e) => e.stopPropagation()}
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = 'https://via.placeholder.com/800x800?text=Photo';
									}}
								/>
							</div>

							{/* 메모 (있는 경우) */}
							{selectedImage.content && (
								<div className='mt-4 bg-black bg-opacity-50 rounded-lg px-4 py-3'>
									<p className='text-sm text-white whitespace-pre-wrap'>
										{selectedImage.content}
									</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

// 새 기록 추가 모달 컴포넌트
function AddDiaryModal({ scheduleId, onClose, onAdd, teamMint, initialDate }) {
	const [content, setContent] = useState('');
	// initialDate가 있으면 사용, 없으면 현재 날짜
	const [date] = useState(initialDate || new Date().toISOString().split('T')[0]);
	const [place, setPlace] = useState(''); // 제목 → 장소로 변경
	const [photo, setPhoto] = useState(null);
	const [photoPreview, setPhotoPreview] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const cameraInputRef = useRef(null);
	const dropZoneRef = useRef(null);

	// 파일 처리 공통 함수
	const processFile = (file) => {
		if (!file || !file.type.startsWith('image/')) {
			alert('이미지 파일만 업로드 가능합니다.');
			return;
		}

		// 미리보기 생성
		const reader = new FileReader();
		reader.onloadend = () => {
			setPhotoPreview(reader.result);
			setPhoto(file);
		};
		reader.readAsDataURL(file);
	};

	// 사진 선택 핸들러
	const handlePhotoChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		processFile(file);
	};

	// 클립보드 붙여넣기 핸들러
	useEffect(() => {
		const handlePaste = async (e) => {
			const items = e.clipboardData?.items;
			if (!items) return;

			for (let i = 0; i < items.length; i++) {
				if (items[i].type.indexOf('image') !== -1) {
					const blob = items[i].getAsFile();
					if (blob) {
						// MIME 타입에서 확장자 결정
						const mimeToExt = {
							'image/jpeg': 'jpg',
							'image/jpg': 'jpg',
							'image/png': 'png',
							'image/gif': 'gif',
							'image/webp': 'webp'
						};
						const ext = mimeToExt[blob.type] || 'png';
						
						// Blob을 File로 변환
						const file = new File([blob], `pasted-image-${Date.now()}.${ext}`, {
							type: blob.type
						});
						processFile(file);
						break;
					}
				}
			}
		};

		// 모달이 마운트되어 있을 때 이벤트 리스너 추가
		window.addEventListener('paste', handlePaste);
		return () => {
			window.removeEventListener('paste', handlePaste);
		};
	}, []);

	// 드래그 앤 드롭 핸들러
	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			processFile(files[0]);
		}
	};

	// 제출 핸들러
	const handleSubmit = async () => {
		if (!photo) {
			alert('사진을 선택해주세요');
			return;
		}

		try {
			// 1. 파일을 서버에 업로드
			const formData = new FormData();
			formData.append('file', photo);

			const uploadResponse = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (!uploadResponse.ok) {
				let errorData;
				try {
					errorData = await uploadResponse.json();
				} catch (e) {
					const text = await uploadResponse.text();
					errorData = { error: '알 수 없는 오류', raw: text };
				}
				console.error('업로드 실패:', {
					status: uploadResponse.status,
					statusText: uploadResponse.statusText,
					error: errorData
				});
				const errorMessage = errorData.details 
					? `${errorData.error}: ${errorData.details}`
					: errorData.error || `파일 업로드 실패 (${uploadResponse.status})`;
				throw new Error(errorMessage);
			}

			let uploadData;
			try {
				uploadData = await uploadResponse.json();
			} catch (e) {
				console.error('업로드 응답 파싱 오류:', e);
				throw new Error('서버 응답을 처리할 수 없습니다');
			}
			
			if (!uploadData.url) {
				console.error('업로드 응답에 URL이 없음:', uploadData);
				throw new Error('업로드된 파일의 URL을 가져올 수 없습니다');
			}
			
			const photoUrl = uploadData.url;

			// 2. 다이어리 생성 (URL 저장)
			const response = await fetch('/api/diary', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title: place || '기록', // 장소명만 title로 저장
					content: content,
					date: date, // initialDate 또는 현재 날짜
					pic: photoUrl
				})
			});

			if (!response.ok) {
				throw new Error('다이어리 저장 실패');
			}

			alert('기록이 추가되었습니다!');
			onAdd();
		} catch (error) {
			console.error('다이어리 저장 오류:', error);
			// 이미 성공 메시지가 표시된 경우 에러를 조용히 처리
			if (error.message && !error.message.includes('기록이 추가되었습니다')) {
				alert(error.message || '기록 저장에 실패했습니다. 다시 시도해주세요.');
			}
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
					{/* 사진 추가 */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							사진 *
						</label>
						<div
							ref={dropZoneRef}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onClick={() => cameraInputRef.current?.click()}
							className={`border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer ${
								isDragging
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-300 bg-gray-50'
							}`}>
							<p className='text-xs text-gray-500 text-center'>
								파일을 여기에 드래그하거나 클릭하거나 Ctrl+V (Cmd+V)로 붙여넣기
							</p>
							<input
								ref={cameraInputRef}
								type='file'
								accept='image/*'
								onChange={handlePhotoChange}
								className='hidden'
							/>
							{photoPreview && (
								<div className='mt-3 flex justify-center'>
									<div className='relative w-full max-w-xs'>
										<Image
											src={photoPreview}
											alt='미리보기'
											width={300}
											height={300}
											className='rounded-lg object-cover w-full h-auto'
										/>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* 장소 */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							장소
						</label>
						<input
							type='text'
							value={place}
							onChange={(e) => setPlace(e.target.value)}
							placeholder='장소를 입력하세요 (예: 나리타 공항)'
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

