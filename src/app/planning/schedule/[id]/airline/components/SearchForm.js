'use client';
import { useState, useEffect } from 'react';
import PassengerSelector from './PassengerSelector';
import { AIRPORTS } from '../data/airports';
import { useParams } from 'next/navigation';

/**
 * props:
 * - onSearch: (data) => void
 * - initialTripType: "ROUND_TRIP" | "ONE_WAY" | "MULTI"
 * - initialDepartureDate: "yyyy-mm-dd"
 * - initialReturnDate: "yyyy-mm-dd"
 */
export default function SearchForm({
	onSearch,
	initialTripType = 'ROUND_TRIP',
	initialDepartureDate = '',
	initialReturnDate = ''
}) {
	const params = useParams();
	const scheduleId = params?.id || null;

	// 검색 타입
	const [tripType, setTripType] = useState(initialTripType); // "ONE_WAY" | "ROUND_TRIP" | "MULTI"

	// 왕복/편도에서 사용
	const [from, setFrom] = useState('');
	const [to, setTo] = useState('');

	// 날짜
	const [departureDate, setDepartureDate] = useState(initialDepartureDate);
	const [returnDate, setReturnDate] = useState(initialReturnDate);

	// 다구간에서 사용
	const [segments, setSegments] = useState([
		{ origin: '', destination: '', date: initialDepartureDate || '' }
	]);

	// 기타 옵션
	const [directOnly, setDirectOnly] = useState(false);
	const [passengers, setPassengers] = useState({});

	// 자동완성
	const [suggestions, setSuggestions] = useState([]);
	const [activeField, setActiveField] = useState(null); // "from" | "to" | `seg-${i}-origin|destination`

	// ✅ localStorage에서 스케줄 불러오기 (id가 있을 때만)
	useEffect(() => {
		if (!scheduleId) return;

		const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
		const matchedSchedule = schedules.find(s => s.id === scheduleId);
		if (!matchedSchedule) return;

		// 기본값 세팅
		if (matchedSchedule.city?.cityCode)
			setTo(matchedSchedule.city.cityCode); // 도착 도시
		if (matchedSchedule.startDate)
			setDepartureDate(matchedSchedule.startDate.slice(0, 10)); // yyyy-mm-dd
		if (matchedSchedule.endDate)
			setReturnDate(matchedSchedule.endDate.slice(0, 10)); // yyyy-mm-dd
	}, [scheduleId]);

	// ✅ 도시명/공항명 검색 → 공항 리스트 반환
	const searchAirports = keyword => {
		if (!keyword.trim()) return [];
		keyword = keyword.trim().toLowerCase();

		let result = [];
		AIRPORTS.forEach(countryItem => {
			// 국가명 히트시 그 국가의 모든 공항
			if (countryItem.country.toLowerCase().includes(keyword)) {
				countryItem.cities.forEach(city =>
					result.push(...city.airports)
				);
			}
			// 도시명
			countryItem.cities.forEach(cityItem => {
				if (cityItem.city.toLowerCase().includes(keyword)) {
					result.push(...cityItem.airports);
				}
				// 공항명
				cityItem.airports.forEach(ap => {
					if (ap.name.toLowerCase().includes(keyword)) {
						result.push(ap);
					}
				});
			});
		});
		// 중복 제거
		const unique = [...new Map(result.map(a => [a.code, a])).values()];
		return unique;
	};

	// ✅ 입력 시 자동완성 검색
	const handleInput = (field, value) => {
		if (field === 'from') setFrom(value);
		else if (field === 'to') setTo(value);
		else if (field.startsWith('seg-')) {
			const [, idxStr, which] = field.split('-');
			const idx = Number(idxStr);
			setSegments(prev =>
				prev.map((s, i) => (i === idx ? { ...s, [which]: value } : s))
			);
		}
		setActiveField(field);
		setSuggestions(searchAirports(value));
	};

	// ✅ 자동완성 선택 (IATA 코드 입력)
	const selectAirport = airport => {
		if (activeField === 'from') setFrom(airport.code);
		else if (activeField === 'to') setTo(airport.code);
		else if (activeField?.startsWith('seg-')) {
			const [, idxStr, which] = activeField.split('-');
			const idx = Number(idxStr);
			setSegments(prev =>
				prev.map((s, i) =>
					i === idx ? { ...s, [which]: airport.code } : s
				)
			);
		}
		setSuggestions([]);
	};

	// ✅ 다구간 세그먼트 추가/삭제
	const addSegment = () =>
		setSegments(prev => [
			...prev,
			{ origin: '', destination: '', date: '' }
		]);
	const removeSegment = idx =>
		setSegments(prev => prev.filter((_, i) => i !== idx));

	// ✅ 실제 검색 실행
	const handleSubmit = () => {
		if (tripType === 'MULTI') {
			if (segments.length < 2) {
				alert('다구간은 최소 2개 이상의 구간이 필요합니다.');
				return;
			}
			const invalid = segments.some(
				s => !s.origin || !s.destination || !s.date
			);
			if (invalid) {
				alert('모든 구간의 출발/도착/날짜를 입력해주세요.');
				return;
			}
			onSearch({
				tripType,
				segments,
				passengers,
				directOnly
			});
			return;
		}

		if (!from || !to) {
			alert('출발지와 도착지를 입력해주세요.');
			return;
		}
		if (!departureDate) {
			alert('출발 날짜를 선택해주세요.');
			return;
		}
		if (tripType === 'ROUND_TRIP' && !returnDate) {
			alert('도착(귀국) 날짜를 선택해주세요.');
			return;
		}

		onSearch({
			tripType,
			from,
			to,
			departureDate,
			returnDate: tripType === 'ROUND_TRIP' ? returnDate : undefined,
			passengers,
			directOnly
		});
	};

	return (
		<section className='bg-white rounded-lg p-3 shadow-sm relative space-y-2'>
			{/* ✅ 여정 타입 선택 */}
			<div className='flex gap-2'>
				<select
					value={tripType}
					onChange={e => setTripType(e.target.value)}
					className='border rounded-lg p-2 text-sm'>
					<option value='ROUND_TRIP'>왕복</option>
					<option value='ONE_WAY'>편도</option>
					<option value='MULTI'>다구간</option>
				</select>

				<label className='flex items-center gap-1 text-sm ml-auto'>
					<input
						type='checkbox'
						checked={directOnly}
						onChange={e => setDirectOnly(e.target.checked)}
					/>
					직항만 보기
				</label>
			</div>

			{/* ✅ 편도/왕복 UI */}
			{tripType !== 'MULTI' && (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
					{/* 출발 입력 */}
					<div className='relative'>
						<input
							placeholder='출발 도시 또는 공항'
							value={from}
							onChange={e => handleInput('from', e.target.value)}
							className='border rounded-lg p-2 text-sm w-full'
						/>
						{activeField === 'from' && suggestions.length > 0 && (
							<div className='absolute left-0 right-0 bg-white border rounded-lg shadow z-10 mt-1 max-h-56 overflow-auto'>
								{suggestions.map(ap => (
									<div
										key={ap.code}
										className='p-2 text-sm hover:bg-slate-100 cursor-pointer'
										onClick={() => selectAirport(ap)}>
										{ap.name} ({ap.code})
									</div>
								))}
							</div>
						)}
					</div>

					{/* 도착 입력 */}
					<div className='relative'>
						<input
							placeholder='도착 도시 또는 공항'
							value={to}
							onChange={e => handleInput('to', e.target.value)}
							className='border rounded-lg p-2 text-sm w-full'
						/>
						{activeField === 'to' && suggestions.length > 0 && (
							<div className='absolute left-0 right-0 bg-white border rounded-lg shadow z-10 mt-1 max-h-56 overflow-auto'>
								{suggestions.map(ap => (
									<div
										key={ap.code}
										className='p-2 text-sm hover:bg-slate-100 cursor-pointer'
										onClick={() => selectAirport(ap)}>
										{ap.name} ({ap.code})
									</div>
								))}
							</div>
						)}
					</div>

					{/* 날짜 입력 */}
					<div className='grid grid-cols-2 gap-2 md:col-span-2'>
						<div>
							<label className='text-xs text-slate-500'>
								출발 날짜
							</label>
							<input
								type='date'
								value={departureDate}
								onChange={e => setDepartureDate(e.target.value)}
								className='border rounded-lg p-2 text-sm w-full'
							/>
						</div>

						{tripType === 'ROUND_TRIP' && (
							<div>
								<label className='text-xs text-slate-500'>
									도착(귀국) 날짜
								</label>
								<input
									type='date'
									value={returnDate}
									onChange={e =>
										setReturnDate(e.target.value)
									}
									className='border rounded-lg p-2 text-sm w-full'
								/>
							</div>
						)}
					</div>
				</div>
			)}

			{/* ✅ 다구간 UI */}
			{tripType === 'MULTI' && (
				<div className='space-y-2'>
					{segments.map((seg, idx) => (
						<div
							key={idx}
							className='grid grid-cols-1 md:grid-cols-3 gap-2 relative'>
							<div className='relative'>
								<input
									placeholder='출발 도시/공항'
									value={seg.origin}
									onChange={e =>
										handleInput(
											`seg-${idx}-origin`,
											e.target.value
										)
									}
									className='border rounded-lg p-2 text-sm w-full'
								/>
								{activeField === `seg-${idx}-origin` &&
									suggestions.length > 0 && (
										<div className='absolute left-0 right-0 bg-white border rounded-lg shadow z-10 mt-1 max-h-56 overflow-auto'>
											{suggestions.map(ap => (
												<div
													key={ap.code}
													className='p-2 text-sm hover:bg-slate-100 cursor-pointer'
													onClick={() =>
														selectAirport(ap)
													}>
													{ap.name} ({ap.code})
												</div>
											))}
										</div>
									)}
							</div>

							<div className='relative'>
								<input
									placeholder='도착 도시/공항'
									value={seg.destination}
									onChange={e =>
										handleInput(
											`seg-${idx}-destination`,
											e.target.value
										)
									}
									className='border rounded-lg p-2 text-sm w-full'
								/>
								{activeField === `seg-${idx}-destination` &&
									suggestions.length > 0 && (
										<div className='absolute left-0 right-0 bg-white border rounded-lg shadow z-10 mt-1 max-h-56 overflow-auto'>
											{suggestions.map(ap => (
												<div
													key={ap.code}
													className='p-2 text-sm hover:bg-slate-100 cursor-pointer'
													onClick={() =>
														selectAirport(ap)
													}>
													{ap.name} ({ap.code})
												</div>
											))}
										</div>
									)}
							</div>

							<div>
								<input
									type='date'
									value={seg.date}
									onChange={e =>
										setSegments(prev =>
											prev.map((s, i) =>
												i === idx
													? {
															...s,
															date: e.target.value
													  }
													: s
											)
										)
									}
									className='border rounded-lg p-2 text-sm w-full'
								/>
							</div>

							{segments.length > 1 && (
								<button
									type='button'
									onClick={() => removeSegment(idx)}
									className='absolute -right-2 -top-2 text-xs px-2 py-1 bg-red-100 text-red-600 rounded'>
									삭제
								</button>
							)}
						</div>
					))}

					<button
						type='button'
						onClick={addSegment}
						className='btn_sub text-sm'>
						+ 구간 추가
					</button>
				</div>
			)}

			<div className='mt-2 flex justify-end items-center'>
				<PassengerSelector onChange={setPassengers} />
			</div>

			<div className='mt-2 flex justify-end items-center'>
				<button onClick={handleSubmit} className='btn_broad text-sm'>
					검색
				</button>
			</div>
		</section>
	);
}
