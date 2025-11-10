'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const TEAM_MINT = '#50B4BE';

export default function TravelLocationPage() {
	const router = useRouter();
	const [currentTab, setCurrentTab] = useState('nearby'); // nearby, schedule, route
	const [selectedCategory, setSelectedCategory] = useState('전체');
	const [currentLocation, setCurrentLocation] = useState({
		name: '',
		address: '현재 위치',
		day: 1,
		countryName: ''
	});
	const [scheduleInfo, setScheduleInfo] = useState(null); // 여행 일정 정보
	const [weather, setWeather] = useState({
		temperature: 18,
		condition: '맑음'
	});
	const [places, setPlaces] = useState([]);
	const [loading, setLoading] = useState(true);
	const [location, setLocation] = useState(null); // { latitude, longitude }
	const [isRealTimeLocation, setIsRealTimeLocation] = useState(false); // 실시간 위치 사용 여부
	const locationWatchIdRef = useRef(null);
	const defaultLocationRef = useRef(null); // 기본 위치 저장

	// 카테고리 목록
	const categories = ['전체', '관광지', '맛집', '쇼핑', '축제'];

	// 주변 장소 검색 함수
	const searchNearbyPlaces = useCallback(async (latitude, longitude) => {
		if (!latitude || !longitude) return;

		try {
			setLoading(true);
			const response = await fetch('/api/places/nearby', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					latitude,
					longitude,
					category: selectedCategory,
					radius: 5000 // 5km 반경
				})
			});

			if (!response.ok) {
				throw new Error('주변 장소 검색 실패');
			}

			const data = await response.json();
			setPlaces(data.places || []);
		} catch (error) {
			console.error('주변 장소 검색 오류:', error);
			setPlaces([]);
		} finally {
			setLoading(false);
		}
	}, [selectedCategory]);

	// 기본 위치 가져오기 (여행 국가의 수도 공항)
	useEffect(() => {
		const fetchDefaultLocation = async () => {
			try {
				const response = await fetch('/api/travel-location');
				if (!response.ok) {
					throw new Error('기본 위치 가져오기 실패');
				}
				const data = await response.json();
				const defaultLocation = {
					latitude: data.location.latitude,
					longitude: data.location.longitude,
					name: data.location.name,
					countryCode: data.countryCode,
					countryName: data.countryName
				};

				// 기본 위치 저장
				defaultLocationRef.current = defaultLocation;

				// 여행 일정 정보 저장
				if (data.startDate && data.endDate) {
					const startDate = new Date(data.startDate);
					const today = new Date();
					const day = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
					setScheduleInfo({
						startDate: data.startDate,
						endDate: data.endDate,
						day: day > 0 ? day : 1
					});
					setCurrentLocation(prev => ({
						...prev,
						day: day > 0 ? day : 1,
						countryName: data.countryName
					}));
				}

				// localStorage에서 마지막 위치 확인
				const lastLocation = localStorage.getItem('travel-location');
				if (lastLocation) {
					try {
						const saved = JSON.parse(lastLocation);
						if (saved.latitude && saved.longitude) {
							setLocation(saved);
							setCurrentLocation(prev => ({
								...prev,
								name: saved.name || defaultLocation.name,
								address: saved.timestamp ? '현재 위치' : '현재 위치'
							}));
							// 저장된 위치로 주변 장소 검색
							searchNearbyPlaces(saved.latitude, saved.longitude);
							return;
						}
					} catch {
						// 파싱 실패 시 기본 위치 사용
					}
				}

				// 저장된 위치가 없으면 기본 위치 사용
				setLocation(defaultLocation);
				setCurrentLocation(prev => ({
					...prev,
					name: defaultLocation.name,
					address: '현재 위치'
				}));
				// 기본 위치로 주변 장소 검색
				searchNearbyPlaces(defaultLocation.latitude, defaultLocation.longitude);
			} catch (error) {
				console.error('기본 위치 가져오기 오류:', error);
				// 에러 시 기본값 (일본)
				const defaultLocation = {
					latitude: 35.5494,
					longitude: 139.7798,
					name: '하네다 공항, 도쿄',
					countryCode: 'JP',
					countryName: '일본'
				};
				defaultLocationRef.current = defaultLocation;
				setLocation(defaultLocation);
				setCurrentLocation(prev => ({
					...prev,
					name: defaultLocation.name
				}));
				searchNearbyPlaces(defaultLocation.latitude, defaultLocation.longitude);
			}
		};

		fetchDefaultLocation();
	}, [searchNearbyPlaces]);

	// 실시간 위치 추적
	useEffect(() => {
		if (!navigator.geolocation) {
			return;
		}

		// 기존 위치 추적 중지
		if (locationWatchIdRef.current !== null) {
			navigator.geolocation.clearWatch(locationWatchIdRef.current);
			locationWatchIdRef.current = null;
		}

		// 위치 권한 확인 및 실시간 추적 시작
		const watchId = navigator.geolocation.watchPosition(
			position => {
				const { latitude, longitude } = position.coords;
				const newLocation = {
					latitude,
					longitude,
					name: '현재 위치',
					timestamp: Date.now()
				};

				// 위치 업데이트 (100m 이상 이동했을 때만 업데이트)
				setLocation(prev => {
					if (prev && prev.latitude && prev.longitude) {
						// 하버사인 공식으로 거리 계산 (km)
						const R = 6371;
						const dLat = ((latitude - prev.latitude) * Math.PI) / 180;
						const dLon = ((longitude - prev.longitude) * Math.PI) / 180;
						const a =
							Math.sin(dLat / 2) * Math.sin(dLat / 2) +
							Math.cos((prev.latitude * Math.PI) / 180) *
								Math.cos((latitude * Math.PI) / 180) *
								Math.sin(dLon / 2) *
								Math.sin(dLon / 2);
						const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
						const distance = R * c;
						
						// 100m 이상 이동했을 때만 업데이트
						if (distance < 0.1) {
							return prev;
						}
					}
					return newLocation;
				});
				setIsRealTimeLocation(true);

				// 현재 위치 표시 업데이트
				setCurrentLocation(prev => ({
					...prev,
					name: '현재 위치',
					address: '현재 위치'
				}));

				// localStorage에 저장
				localStorage.setItem('travel-location', JSON.stringify(newLocation));

				// 주변 장소 검색
				searchNearbyPlaces(latitude, longitude);
			},
			error => {
				console.error('위치 추적 오류:', error);
				// 에러 발생 시 실시간 위치 비활성화
				setIsRealTimeLocation(false);

				// localStorage에서 마지막 위치 가져오기
				const lastLocation = localStorage.getItem('travel-location');
				if (lastLocation) {
					try {
						const saved = JSON.parse(lastLocation);
						if (saved.latitude && saved.longitude && saved.timestamp) {
							// 타임스탬프가 있으면 실시간 위치였던 것
							setLocation(saved);
							searchNearbyPlaces(saved.latitude, saved.longitude);
							return;
						}
					} catch {
						// 파싱 실패
					}
				}

				// 저장된 위치가 없거나 실시간 위치가 아니면 기본 위치 사용
				if (defaultLocationRef.current) {
					setLocation(defaultLocationRef.current);
					setCurrentLocation(prev => ({
						...prev,
						name: defaultLocationRef.current.name,
						address: '현재 위치'
					}));
					searchNearbyPlaces(
						defaultLocationRef.current.latitude,
						defaultLocationRef.current.longitude
					);
				}
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0
			}
		);

		locationWatchIdRef.current = watchId;

		// 컴포넌트 언마운트 시 위치 추적 중지
		return () => {
			if (locationWatchIdRef.current !== null) {
				navigator.geolocation.clearWatch(locationWatchIdRef.current);
				locationWatchIdRef.current = null;
			}
		};
	}, [searchNearbyPlaces]);

	// API에서 이미 필터링된 결과를 받아오므로 추가 필터링 불필요
	const filteredPlaces = places;

	// 길찾기 함수
	const handleFindRoute = place => {
		if (place.location) {
			const { latitude, longitude } = place.location;
			window.open(
				`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
				'_blank'
			);
		} else {
			window.open(
				`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`,
				'_blank'
			);
		}
	};

	// 자세히 보기 함수
	const handleViewDetails = place => {
		// TODO: 상세 페이지로 이동
		console.log('자세히:', place.name);
	};

	return (
		<div className="min-h-screen bg-white">
			{/* 헤더 */}
			<header className="sticky top-0 z-20 w-full bg-white border-b border-gray-200">
				<div className="max-w-[700px] mx-auto px-4 py-3">
					<div className="flex items-center justify-between mb-2">
						<h1 className="text-lg font-semibold">여행 중</h1>
						<div className="flex items-center gap-3">
							<button>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2">
									<circle cx="12" cy="12" r="1" />
									<circle cx="12" cy="5" r="1" />
									<circle cx="12" cy="19" r="1" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* 위치 및 날씨 배너 */}
			<div
				className="w-full px-4 py-4"
				style={{ backgroundColor: TEAM_MINT }}>
				<div className="max-w-[700px] mx-auto">
					<div className="flex items-start justify-between text-white">
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-1">
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2">
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
									<circle cx="12" cy="10" r="3" />
								</svg>
								<span className="text-sm">{currentLocation.address}</span>
							</div>
							<h2 className="text-xl font-bold mb-1">
								{currentLocation.name || '위치 정보 없음'}
							</h2>
							{scheduleInfo && (
								<p className="text-sm opacity-90">
									{currentLocation.countryName || '여행'} 여행 {scheduleInfo.day}일차
								</p>
							)}
						</div>
						<div className="text-right">
							<div className="text-3xl font-bold">
								{weather.temperature}°C
							</div>
							<div className="text-sm opacity-90">{weather.condition}</div>
						</div>
					</div>
				</div>
			</div>

			{/* 탭 메뉴 */}
			<div className="max-w-[700px] mx-auto px-4 py-3 border-b border-gray-200">
				<div className="flex gap-2">
					<button
						onClick={() => setCurrentTab('nearby')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							currentTab === 'nearby'
								? 'bg-gray-100 text-gray-900'
								: 'text-gray-500'
						}`}>
						주변 정보
					</button>
					<button
						onClick={() => setCurrentTab('schedule')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							currentTab === 'schedule'
								? 'bg-gray-100 text-gray-900'
								: 'text-gray-500'
						}`}>
						오늘 일정
					</button>
					<button
						onClick={() => setCurrentTab('route')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							currentTab === 'route'
								? 'bg-gray-100 text-gray-900'
								: 'text-gray-500'
						}`}>
						최적 동선
					</button>
				</div>
			</div>

			{/* 주변 정보 탭 */}
			{currentTab === 'nearby' && (
				<div className="max-w-[700px] mx-auto pb-20">
					{/* 카테고리 필터 */}
					<div className="px-4 py-4 flex gap-3 overflow-x-auto">
						{categories.map(category => (
							<button
								key={category}
								onClick={() => setSelectedCategory(category)}
								className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
									selectedCategory === category
										? 'bg-[#50B4BE] text-white'
										: 'bg-gray-100 text-gray-700'
								}`}>
								{category}
							</button>
						))}
					</div>

					{/* 장소 리스트 */}
					<div className="px-4 space-y-4">
						{loading ? (
							<div className="text-center py-8 text-gray-500">
								로딩 중...
							</div>
						) : filteredPlaces.length === 0 ? (
							<div className="text-center py-8 text-gray-500">
								주변에 장소가 없습니다
							</div>
						) : (
							filteredPlaces.map(place => (
								<PlaceCard
									key={place.id}
									place={place}
									onFindRoute={handleFindRoute}
									onViewDetails={handleViewDetails}
								/>
							))
						)}
					</div>
				</div>
			)}

			{/* 오늘 일정 탭 */}
			{currentTab === 'schedule' && (
				<div className="max-w-[700px] mx-auto px-4 py-8 pb-20">
					<div className="text-center text-gray-500">
						오늘 일정 기능은 준비 중입니다
					</div>
				</div>
			)}

			{/* 최적 동선 탭 */}
			{currentTab === 'route' && (
				<div className="max-w-[700px] mx-auto px-4 py-8 pb-20">
					<div className="text-center text-gray-500">
						최적 동선 기능은 준비 중입니다
					</div>
				</div>
			)}
		</div>
	);
}

// 장소 카드 컴포넌트
function PlaceCard({ place, onFindRoute, onViewDetails }) {
	return (
		<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
			<div className="flex">
				{/* 이미지 */}
				<div className="w-24 h-24 flex-shrink-0 relative">
					<Image
						src={place.image}
						alt={place.name}
						fill
						className="object-cover"
					/>
				</div>

				{/* 정보 */}
				<div className="flex-1 p-3">
					<h3 className="font-bold text-gray-900 mb-1">{place.name}</h3>
					<div className="flex items-center gap-2 mb-2 flex-wrap">
						<span
							className="px-2 py-0.5 rounded text-xs font-medium"
							style={{
								backgroundColor: '#E0F2FE',
								color: '#0369A1'
							}}>
							{place.category}
						</span>
						<span className="text-xs text-gray-500">
							{place.distance}km
						</span>
						<div className="flex items-center gap-1">
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="#FCD34D"
								stroke="#FCD34D">
								<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
							</svg>
							<span className="text-xs text-gray-700">{place.rating}</span>
						</div>
					</div>
					<p className="text-xs text-gray-600 mb-3">{place.description}</p>

					{/* 버튼 */}
					<div className="flex gap-2">
						<button
							onClick={() => onFindRoute(place)}
							className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-1"
							style={{ backgroundColor: TEAM_MINT }}>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2">
								<polygon points="5 3 19 12 5 21 5 3" />
							</svg>
							길찾기
						</button>
						<button
							onClick={() => onViewDetails(place)}
							className="flex-1 px-3 py-2 rounded-lg text-sm font-medium border"
							style={{
								borderColor: TEAM_MINT,
								color: TEAM_MINT,
								backgroundColor: 'white'
							}}>
							자세히
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

