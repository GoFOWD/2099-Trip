'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Header from '@/share/ui/Header';
import ProgressBar from '@/share/ui/ProgressBar';

export default function BudgetAllocationPage() {
	const router = useRouter();
	const [airfare, setAirfare] = useState(0); // 만원 단위
	const [accommodation, setAccommodation] = useState(0); // 만원 단위
	const [totalBudget, setTotalBudget] = useState(200); // 만원 단위
	const [airfareMin, setAirfareMin] = useState(0);
	const [airfareMax, setAirfareMax] = useState(0);
	const [accommodationMin, setAccommodationMin] = useState(0);
	const [accommodationMax, setAccommodationMax] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isAirfareReserved, setIsAirfareReserved] = useState(false); // 항공권 예약 여부
	const [isAccommodationReserved, setIsAccommodationReserved] =
		useState(false); // 숙박 예약 여부
	const params = useParams();
	const { id } = params;
	const scheduleId = id;

	// API에서 데이터 가져오기
	useEffect(() => {
		const fetchBudgetData = async () => {
			try {
				setIsLoading(true);
				const response = await fetch('/api/budget-allocation');

				if (!response.ok) {
					// API 응답에서 에러 메시지 가져오기
					let errorMessage = '데이터를 가져오는데 실패했습니다';
					try {
						const errorData = await response.json();
						errorMessage = errorData.error || errorMessage;
					} catch {
						// JSON 파싱 실패 시 기본 메시지 사용
						errorMessage = `서버 오류 (${response.status})`;
					}
					throw new Error(errorMessage);
				}

				const data = await response.json();

				// 총 예산 설정
				setTotalBudget(data.totalBudget);

				// 항공료 최소값: 항상 1만원
				setAirfareMin(1);

				// 항공료 최대값: 항상 1000만원
				setAirfareMax(1000);

				// 숙박비 최소값: 항상 1만원
				setAccommodationMin(1);

				// 숙박비 최대값: 항상 1000만원
				setAccommodationMax(1000);

				// 초기값 설정 (이미 Budget이 있으면 그 값 사용, 없으면 최소값(1만원) 사용)
				if (data.budget) {
					setAirfare(data.budget.airTicketPlan || 1);
					setAccommodation(data.budget.hotelPlan || 1);
				} else {
					setAirfare(data.minAirfare || 1);
					setAccommodation(data.minAccommodation || 1);
				}

				setError(null);
			} catch (err) {
				console.error('예산 데이터 로딩 오류:', err);
				setError(err.message);
				// 에러 시 사용자가 직접 선택할 수 있도록 넓은 범위 설정
				setAirfareMin(1); // 1만원
				setAirfareMax(1000); // 1000만원
				setAccommodationMin(1); // 1만원
				setAccommodationMax(1000); // 1000만원
				setTotalBudget(1000); // 기본 총 예산 1000만원
				setAirfare(100); // 기본 항공료 100만원
				setAccommodation(100); // 기본 숙박비 100만원
			} finally {
				setIsLoading(false);
			}
		};

		fetchBudgetData();
	}, []);

	// 기타 예산 (자동 계산)
	// 이미 예약한 항목은 제외
	const other =
		totalBudget -
		(isAirfareReserved ? 0 : airfare) -
		(isAccommodationReserved ? 0 : accommodation);

	// 숫자를 만원 단위로 포맷팅
	const formatWon = value => {
		return `${value}만원`;
	};

	// 다음 버튼 클릭 핸들러 (예산 저장)
	const handleNext = async () => {
		try {
			// 예약한 항목은 0으로 저장
			const airTicketPlan = isAirfareReserved ? 0 : airfare;
			const hotelPlan = isAccommodationReserved ? 0 : accommodation;

			// 예산을 데이터베이스에 저장
			const response = await fetch('/api/budget-allocation', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					airTicketPlan: airTicketPlan,
					hotelPlan: hotelPlan,
					otherSpending: other,
					scheduleId
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || '예산 저장에 실패했습니다');
			}

			// 저장 성공 시 다음 페이지로 이동
			// TODO: 다음 단계 페이지 경로로 수정 필요
			// router.push('/다음페이지경로');
		} catch (error) {
			console.error('예산 저장 오류:', error);
			alert(error.message || '예산 저장에 실패했습니다');
		}
	};

	// 이전 버튼 클릭 핸들러
	const handlePrevious = () => {
		router.push('/total-budget');
	};

	return (
		<div className='min-h-screen bg-white'>
			<Header>
				<div className='flex items-center justify-between mb-1'>
					<span className='text-sm text-gray-500'>단계 5/10</span>
					<span className='text-sm text-gray-500'>60% 완료</span>
				</div>
				<ProgressBar step={5} total={10} />
			</Header>

			<main className='p-4 pb-20'>
				<h2 className='text-2xl font-bold text-gray-800 mb-2'>
					예산 배분 설정
				</h2>
				<p className='text-sm text-gray-600 mb-6'>
					슬라이드를 조절하여 항목별 예산을 정해보세요
				</p>

				{isLoading && (
					<div className='text-center py-8'>
						<p className='text-gray-500'>데이터를 불러오는 중...</p>
					</div>
				)}

				{!isLoading && (
					<>
						{/* 항공료 */}
						<div className='mb-6'>
							<div className='flex justify-between items-center mb-2'>
								<span className='font-bold text-gray-800'>
									항공료
								</span>
								<span
									className='text-lg font-bold'
									style={{ color: '#50B4BE' }}>
									{isAirfareReserved
										? '예약 완료'
										: formatWon(airfare)}
								</span>
							</div>

							<div className='relative mb-2'>
								<input
									type='range'
									min={airfareMin}
									max={airfareMax}
									value={airfare}
									onChange={e => {
										const newValue = parseInt(
											e.target.value
										);
										// 최대값이 총 예산을 넘지 않도록 제한
										const accommodationValue =
											isAccommodationReserved
												? 0
												: accommodation;
										if (
											newValue + accommodationValue <=
											totalBudget - 5
										) {
											setAirfare(newValue);
										} else {
											// 총 예산을 넘으면 자동으로 조정
											setAirfare(
												totalBudget -
													accommodationValue -
													5
											);
										}
									}}
									disabled={isAirfareReserved}
									className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${
										isAirfareReserved
											? 'opacity-50 cursor-not-allowed'
											: ''
									}`}
									style={{
										background: `linear-gradient(to right, #50B4BE 0%, #50B4BE ${
											((airfare - airfareMin) /
												(airfareMax - airfareMin)) *
											100
										}%, #E5E7EB ${
											((airfare - airfareMin) /
												(airfareMax - airfareMin)) *
											100
										}%, #E5E7EB 100%)`
									}}
								/>
								<style jsx>{`
									input[type='range']::-webkit-slider-thumb {
										appearance: none;
										width: 20px;
										height: 20px;
										border-radius: 50%;
										background: #50b4be;
										cursor: pointer;
										border: 2px solid white;
										box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
									}
									input[type='range']::-moz-range-thumb {
										width: 20px;
										height: 20px;
										border-radius: 50%;
										background: #50b4be;
										cursor: pointer;
										border: 2px solid white;
										box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
									}
								`}</style>
							</div>

							<div className='flex justify-between text-xs text-gray-500 mb-1'>
								<span>최소 {formatWon(airfareMin)}</span>
								<span>최대 {formatWon(airfareMax)}</span>
							</div>

							<p className='text-xs text-gray-500 mt-2'>
								해당 여행 기간의 최저 항공료보다 낮은 가격으로는
								설정할 수 없습니다
							</p>

							{/* 이미 예약한 경우 체크 버튼 */}
							<div className='flex items-center gap-2 mt-3'>
								<button
									onClick={() =>
										setIsAirfareReserved(!isAirfareReserved)
									}
									className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
										isAirfareReserved
											? 'bg-[#50B4BE] border-[#50B4BE]'
											: 'bg-white border-gray-300'
									}`}>
									{isAirfareReserved && (
										<svg
											className='w-3 h-3 text-white'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M5 13l4 4L19 7'
											/>
										</svg>
									)}
								</button>
								<span className='text-sm text-gray-700'>
									이미 항공권을 예약했습니다
								</span>
							</div>
						</div>

						{/* 숙박비 */}
						<div className='mb-6'>
							<div className='flex justify-between items-center mb-2'>
								<span className='font-bold text-gray-800'>
									숙박비
								</span>
								<span
									className='text-lg font-bold'
									style={{ color: '#50B4BE' }}>
									{isAccommodationReserved
										? '예약 완료'
										: formatWon(accommodation)}
								</span>
							</div>

							<div className='relative mb-2'>
								<input
									type='range'
									min={accommodationMin || 1}
									max={accommodationMax}
									value={accommodation}
									onChange={e => {
										const newValue = parseInt(
											e.target.value
										);
										// 총 예산을 넘지 않도록 제한
										const airfareValue = isAirfareReserved
											? 0
											: airfare;
										if (
											airfareValue + newValue <=
											totalBudget - 5
										) {
											setAccommodation(newValue);
										} else {
											// 총 예산을 넘으면 자동으로 조정
											setAccommodation(
												totalBudget - airfareValue - 5
											);
										}
									}}
									disabled={isAccommodationReserved}
									className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${
										isAccommodationReserved
											? 'opacity-50 cursor-not-allowed'
											: ''
									}`}
									style={{
										background: `linear-gradient(to right, #50B4BE 0%, #50B4BE ${
											(accommodation / accommodationMax) *
											100
										}%, #E5E7EB ${
											(accommodation / accommodationMax) *
											100
										}%, #E5E7EB 100%)`
									}}
								/>
								<style jsx>{`
									input[type='range']::-webkit-slider-thumb {
										appearance: none;
										width: 20px;
										height: 20px;
										border-radius: 50%;
										background: #50b4be;
										cursor: pointer;
										border: 2px solid white;
										box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
									}
									input[type='range']::-moz-range-thumb {
										width: 20px;
										height: 20px;
										border-radius: 50%;
										background: #50b4be;
										cursor: pointer;
										border: 2px solid white;
										box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
									}
								`}</style>
							</div>

							<div className='flex justify-end text-xs text-gray-500 mb-1'>
								<span>최대 {formatWon(accommodationMax)}</span>
							</div>

							<p className='text-xs text-gray-500 mt-2'>
								남은 예산 내에서 숙박비를 조절할 수 있습니다
							</p>

							{/* 이미 예약한 경우 체크 버튼 */}
							<div className='flex items-center gap-2 mt-3'>
								<button
									onClick={() =>
										setIsAccommodationReserved(
											!isAccommodationReserved
										)
									}
									className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
										isAccommodationReserved
											? 'bg-[#50B4BE] border-[#50B4BE]'
											: 'bg-white border-gray-300'
									}`}>
									{isAccommodationReserved && (
										<svg
											className='w-3 h-3 text-white'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M5 13l4 4L19 7'
											/>
										</svg>
									)}
								</button>
								<span className='text-sm text-gray-700'>
									이미 숙박시설을 예약했습니다
								</span>
							</div>
						</div>

						{/* 기타 (음식, 쇼핑, 체험) */}
						<div className='mb-8'>
							<div className='flex justify-between items-center mb-2'>
								<span className='font-bold text-gray-800'>
									기타 (음식, 쇼핑, 체험)
								</span>
								<span className='text-lg font-bold text-green-600'>
									{formatWon(other)}
								</span>
							</div>

							<div className='relative mb-2'>
								<div
									className='h-2 rounded-lg'
									style={{
										backgroundColor: '#22C55E',
										width: '100%'
									}}
								/>
							</div>

							<p className='text-xs text-gray-500 mt-2'>
								남은 예산이 자동으로 배정됩니다
							</p>
						</div>
					</>
				)}

				{/* 하단 버튼 */}
				<div className='fixed bottom-[65px] left-0 right-0 max-w-[700px] mx-auto bg-white border-t border-gray-200 p-4 flex gap-3'>
					<button
						onClick={handlePrevious}
						className='flex-1 py-3 px-4 rounded-lg border-2 text-center font-medium transition-colors'
						style={{
							borderColor: '#50B4BE',
							color: '#50B4BE',
							backgroundColor: 'white'
						}}
						onMouseEnter={e => {
							e.currentTarget.style.backgroundColor = '#F0F9FA';
						}}
						onMouseLeave={e => {
							e.currentTarget.style.backgroundColor = 'white';
						}}>
						← 이전
					</button>
					<button
						onClick={handleNext}
						className='flex-1 py-3 px-4 rounded-lg text-center font-medium text-white transition-colors'
						style={{
							backgroundColor: '#50B4BE'
						}}
						onMouseEnter={e => {
							e.currentTarget.style.backgroundColor = '#3A9BA8';
						}}
						onMouseLeave={e => {
							e.currentTarget.style.backgroundColor = '#50B4BE';
						}}>
						다음 →
					</button>
				</div>
			</main>
		</div>
	);
}
