'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import { getWeather } from '@/share/util/getWeather';

const TEAM_MINT = '#50B4BE';

// 날짜 차이 계산 유틸 함수
const calculateDayDifference = (startDate, today) => {
	const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
	const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
	const daysDiff = Math.ceil((todayOnly - startDateOnly) / (1000 * 60 * 60 * 24));
	return daysDiff < 0 ? daysDiff : daysDiff + 1;
};

// 하버사인 공식으로 거리 계산 (km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
	const R = 6371;
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
};

export default function TravelLocationPage() {
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
	const [showMapModal, setShowMapModal] = useState(false); // 지도 모달 표시 여부
	const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소
	const mapRef = useRef(null); // 지도 인스턴스 참조
	const mapContainerRef = useRef(null); // 지도 컨테이너 참조
	const markersRef = useRef([]); // 마커 배열 참조
	const lineRef = useRef(null); // 선 참조
	const [showReviewsModal, setShowReviewsModal] = useState(false); // 리뷰 모달 표시 여부
	const [reviews, setReviews] = useState([]); // 리뷰 목록
	const [reviewsLoading, setReviewsLoading] = useState(false); // 리뷰 로딩 상태
	const [reviewsPlaceName, setReviewsPlaceName] = useState(''); // 리뷰 장소 이름
	const [todaySchedule, setTodaySchedule] = useState([]); // 오늘 일정
	const [scheduleLoading, setScheduleLoading] = useState(false); // 일정 로딩 상태
	const [searchQuery, setSearchQuery] = useState(''); // 검색어
	const [searchResults, setSearchResults] = useState([]); // 검색 결과
	const [isSearching, setIsSearching] = useState(false); // 검색 중 여부
	const [showSearchResults, setShowSearchResults] = useState(false); // 검색 결과 표시 여부
	const searchTimeoutRef = useRef(null); // 검색 디바운스용
	const [showAddScheduleModal, setShowAddScheduleModal] = useState(false); // 일정 추가 모달 표시 여부
	const [selectedPlaceForSchedule, setSelectedPlaceForSchedule] = useState(null); // 일정 추가할 장소
	const [currentScheduleId, setCurrentScheduleId] = useState(null); // 현재 스케줄 ID

	// 카테고리 목록
	const categories = ['전체', '관광지', '맛집', '쇼핑'];

	// 날씨 정보 가져오기 함수
	const fetchWeather = useCallback(async (latitude, longitude) => {
		const weatherData = await getWeather(latitude, longitude);
		if (weatherData) {
			setWeather({
				temperature: weatherData.temperature,
				condition: weatherData.condition
			});
		}
	}, []);

	// 주변 장소 검색 함수
	const searchNearbyPlaces = useCallback(
		async (latitude, longitude) => {
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
		},
		[selectedCategory]
	);

	// 위치 업데이트 후 공통 작업 (주변 장소 검색 및 날씨 정보 가져오기)
	const updateLocationAndFetchData = useCallback((latitude, longitude) => {
		searchNearbyPlaces(latitude, longitude);
		fetchWeather(latitude, longitude);
	}, [searchNearbyPlaces, fetchWeather]);

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
					const day = calculateDayDifference(startDate, today);
					
					setScheduleInfo({
						startDate: data.startDate,
						endDate: data.endDate,
						day: day
					});
					setCurrentLocation(prev => ({
						...prev,
						day: day,
						countryName: data.countryName
					}));
					
					// scheduleId 저장
					if (data.scheduleId) {
						setCurrentScheduleId(data.scheduleId);
					}
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
								address: '현재 위치'
							}));
							// 저장된 위치로 주변 장소 검색 및 날씨 정보 가져오기
							updateLocationAndFetchData(saved.latitude, saved.longitude);
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
				// 기본 위치로 주변 장소 검색 및 날씨 정보 가져오기
				updateLocationAndFetchData(defaultLocation.latitude, defaultLocation.longitude);
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
				updateLocationAndFetchData(defaultLocation.latitude, defaultLocation.longitude);
			}
		};

		fetchDefaultLocation();
	}, [updateLocationAndFetchData]);

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
						const distance = calculateDistance(
							prev.latitude,
							prev.longitude,
							latitude,
							longitude
						);
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
				localStorage.setItem(
					'travel-location',
					JSON.stringify(newLocation)
				);

				// 주변 장소 검색 및 날씨 정보 가져오기
				updateLocationAndFetchData(latitude, longitude);
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
						if (
							saved.latitude &&
							saved.longitude &&
							saved.timestamp
						) {
							// 타임스탬프가 있으면 실시간 위치였던 것
							setLocation(saved);
							updateLocationAndFetchData(saved.latitude, saved.longitude);
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
					updateLocationAndFetchData(
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
	}, [updateLocationAndFetchData]);

	// 위치 정보 최신화 함수
	const updateLocation = useCallback(() => {
		if (!navigator.geolocation) return;

		navigator.geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords;
				const newLocation = {
					latitude,
					longitude,
					name: '현재 위치',
					timestamp: Date.now()
				};

				setLocation(newLocation);
				setIsRealTimeLocation(true);
				
				// day 재계산 (페이지 포커스 시 날짜가 바뀌었을 수 있음)
				setScheduleInfo(prev => {
					if (prev && prev.startDate) {
						const startDate = new Date(prev.startDate);
						const today = new Date();
						const day = calculateDayDifference(startDate, today);
						
						// currentLocation의 day도 함께 업데이트
						setCurrentLocation(currentPrev => ({
							...currentPrev,
							name: '현재 위치',
							address: '현재 위치',
							day: day
						}));
						
						return {
							...prev,
							day: day
						};
					} else {
						// scheduleInfo가 없거나 startDate가 없으면 name과 address만 업데이트
						setCurrentLocation(currentPrev => ({
							...currentPrev,
							name: '현재 위치',
							address: '현재 위치'
						}));
					}
					return prev;
				});

				// localStorage에 저장
				localStorage.setItem('travel-location', JSON.stringify(newLocation));

				// 주변 장소 검색 및 날씨 정보 가져오기
				updateLocationAndFetchData(latitude, longitude);
			},
			error => {
				console.error('위치 업데이트 오류:', error);
				// 에러 시 저장된 위치나 기본 위치 사용
				const lastLocation = localStorage.getItem('travel-location');
				if (lastLocation) {
					try {
						const saved = JSON.parse(lastLocation);
						if (saved.latitude && saved.longitude) {
							setLocation(saved);
							updateLocationAndFetchData(saved.latitude, saved.longitude);
							return;
						}
					} catch {
						// 파싱 실패
					}
				}

				// 기본 위치 사용
				if (defaultLocationRef.current) {
					setLocation(defaultLocationRef.current);
					updateLocationAndFetchData(
						defaultLocationRef.current.latitude,
						defaultLocationRef.current.longitude
					);
				}
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0 // 캐시 사용 안 함, 항상 최신 위치
			}
		);
	}, [updateLocationAndFetchData]);

	// 페이지 포커스/가시성 변경 시 위치 업데이트
	useEffect(() => {
		// 페이지가 다시 보일 때 (앱을 다시 열었을 때)
		const handleVisibilityChange = () => {
			if (!document.hidden) {
				// 페이지가 다시 보이면 위치 업데이트
				updateLocation();
			}
		};

		// 페이지가 포커스를 받을 때 (다른 탭에서 돌아왔을 때)
		const handleFocus = () => {
			updateLocation();
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('focus', handleFocus);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('focus', handleFocus);
		};
	}, [updateLocation]);

	// 여행 전/중 판단 및 장소 정렬
	const filteredPlaces = useMemo(() => {
		if (places.length === 0) return [];

		// 여행 전인지 여행 중인지 판단
		const isBeforeTrip = scheduleInfo && scheduleInfo.startDate
			? new Date() < new Date(scheduleInfo.startDate)
			: true; // 일정 정보가 없으면 여행 전으로 간주

		if (isBeforeTrip) {
			// 여행 전: 평점이 높고 리뷰가 많은 순으로 정렬
			return [...places].sort((a, b) => {
				// 먼저 평점으로 정렬 (높은 순)
				if (b.rating !== a.rating) {
					return b.rating - a.rating;
				}
				// 평점이 같으면 리뷰 개수로 정렬 (많은 순)
				return (b.userRatingCount || 0) - (a.userRatingCount || 0);
			});
		} else {
			// 여행 중: 거리순으로 정렬 (기존 방식)
			return [...places].sort((a, b) => {
				return (a.distance || 0) - (b.distance || 0);
			});
		}
	}, [places, scheduleInfo]);

	// 길찾기 함수 - 지도 모달 열기
	const handleFindRoute = place => {
		if (place.location) {
			setSelectedPlace(place);
			setShowMapModal(true);
		}
	};

	// Google Maps API 로드 및 지도 초기화
	useEffect(() => {
		if (!showMapModal || !selectedPlace || !selectedPlace.location || !location) {
			return;
		}

		const loadGoogleMaps = () => {
			// 이미 로드되어 있는지 확인
			if (window.google && window.google.maps) {
				initMap();
				return;
			}

			// Google Maps API 스크립트 로드
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&language=ko`;
			script.async = true;
			script.defer = true;
			script.onload = () => {
				initMap();
			};
			document.head.appendChild(script);
		};

		const initMap = () => {
			if (!mapContainerRef.current) return;

			const currentLat = location.latitude;
			const currentLon = location.longitude;
			const destLat = selectedPlace.location.latitude;
			const destLon = selectedPlace.location.longitude;

			// 기존 마커와 선 제거
			markersRef.current.forEach(marker => marker.setMap(null));
			if (lineRef.current) {
				lineRef.current.setMap(null);
			}
			markersRef.current = [];

			// 기존 지도가 있으면 재사용, 없으면 새로 생성
			let map = mapRef.current;
			if (!map) {
				// 지도 중심을 두 위치의 중간으로 설정
				const centerLat = (currentLat + destLat) / 2;
				const centerLon = (currentLon + destLon) / 2;

				// 지도 생성
				map = new window.google.maps.Map(mapContainerRef.current, {
					zoom: 13,
					center: { lat: centerLat, lng: centerLon },
					mapTypeControl: false,
					fullscreenControl: false,
					streetViewControl: false
				});

				mapRef.current = map;
			}

			// 현재 위치 마커
			const currentMarker = new window.google.maps.Marker({
				position: { lat: currentLat, lng: currentLon },
				map: map,
				title: '현재 위치',
				icon: {
					path: window.google.maps.SymbolPath.CIRCLE,
					scale: 8,
					fillColor: '#50B4BE',
					fillOpacity: 1,
					strokeColor: '#ffffff',
					strokeWeight: 2
				},
				label: {
					text: '현재',
					color: '#ffffff',
					fontSize: '12px',
					fontWeight: 'bold'
				}
			});
			markersRef.current.push(currentMarker);

			// 목적지 마커
			const destMarker = new window.google.maps.Marker({
				position: { lat: destLat, lng: destLon },
				map: map,
				title: selectedPlace.name,
				icon: {
					path: window.google.maps.SymbolPath.CIRCLE,
					scale: 8,
					fillColor: '#FF6B6B',
					fillOpacity: 1,
					strokeColor: '#ffffff',
					strokeWeight: 2
				},
				label: {
					text: '목적지',
					color: '#ffffff',
					fontSize: '12px',
					fontWeight: 'bold'
				}
			});
			markersRef.current.push(destMarker);

			// 두 마커 사이의 직선 표시
			const line = new window.google.maps.Polyline({
				path: [
					{ lat: currentLat, lng: currentLon },
					{ lat: destLat, lng: destLon }
				],
				geodesic: true,
				strokeColor: '#50B4BE',
				strokeOpacity: 0.6,
				strokeWeight: 3
			});
			line.setMap(map);
			lineRef.current = line;

			// 두 마커가 모두 보이도록 지도 범위 조정
			const bounds = new window.google.maps.LatLngBounds();
			bounds.extend({ lat: currentLat, lng: currentLon });
			bounds.extend({ lat: destLat, lng: destLon });
			map.fitBounds(bounds);
		};

		loadGoogleMaps();

		// 클린업 함수
		return () => {
			markersRef.current.forEach(marker => marker.setMap(null));
			markersRef.current = [];
			if (lineRef.current) {
				lineRef.current.setMap(null);
				lineRef.current = null;
			}
		};
	}, [showMapModal, selectedPlace, location]);

	// 일정 추가 함수 (여행지에서)
	const handleAddToSchedule = place => {
		setSelectedPlaceForSchedule(place);
		setShowAddScheduleModal(true);
	};

	// 오늘 일정 가져오기
	useEffect(() => {
		if (currentTab !== 'schedule' || !currentScheduleId) return;

		const fetchTodaySchedule = async () => {
			setScheduleLoading(true);
			try {
				const response = await fetch(`/api/today-schedule?scheduleId=${currentScheduleId}`);
				if (!response.ok) {
					throw new Error('일정 가져오기 실패');
				}
				const data = await response.json();
				
				// API에서 가져온 일정만 사용 (데이터베이스에 저장된 일정 포함)
				const allSchedules = data.schedule || [];
				
				// datetime 기준으로 정렬
				allSchedules.sort((a, b) => {
					const dateA = a.datetime ? new Date(a.datetime) : new Date();
					const dateB = b.datetime ? new Date(b.datetime) : new Date();
					return dateA - dateB;
				});
				
				setTodaySchedule(allSchedules);
			} catch (error) {
				console.error('일정 가져오기 오류:', error);
				setTodaySchedule([]);
			} finally {
				setScheduleLoading(false);
			}
		};

		fetchTodaySchedule();
	}, [currentTab, currentScheduleId]);

	// 장소 검색 함수
	const searchPlaces = useCallback(async (query) => {
		if (!query || query.trim().length === 0) {
			setSearchResults([]);
			setShowSearchResults(false);
			return;
		}

		setIsSearching(true);
		try {
			const response = await fetch('/api/places/search', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: query.trim(),
					latitude: location?.latitude,
					longitude: location?.longitude
				})
			});

			if (!response.ok) {
				throw new Error('장소 검색 실패');
			}

			const data = await response.json();
			setSearchResults(data.places || []);
			setShowSearchResults(true);
		} catch (error) {
			console.error('장소 검색 오류:', error);
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	}, [location]);

	// 검색어 입력 핸들러 (디바운스 적용)
	const handleSearchChange = useCallback((value) => {
		setSearchQuery(value);
		setShowSearchResults(false);

		// 기존 타이머 취소
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		// 300ms 후 검색 실행 (디바운스)
		if (value.trim().length > 0) {
			searchTimeoutRef.current = setTimeout(() => {
				searchPlaces(value);
			}, 300);
		} else {
			// 검색어를 지우면 검색 결과 초기화하고 주변 장소로 돌아가기
			setSearchResults([]);
		}
	}, [searchPlaces]);

	// 검색 결과 선택 시
	const handleSelectSearchResult = useCallback((place) => {
		setSearchQuery(place.name);
		setShowSearchResults(false);
		// 검색 결과를 places에 설정
		setPlaces([place]);
	}, []);

	// 외부 클릭 시 자동완성 목록 닫기
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (showSearchResults && !event.target.closest('.search-container')) {
				setShowSearchResults(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showSearchResults]);

	// 주소 복사 함수
	const handleCopyAddress = useCallback(async (address) => {
		try {
			await navigator.clipboard.writeText(address);
			alert('주소가 복사되었습니다');
		} catch (error) {
			console.error('주소 복사 실패:', error);
			alert('주소 복사에 실패했습니다');
		}
	}, []);

	// 리뷰 보기 함수
	const handleViewReviews = async place => {
		if (!place.id) return;

		setShowReviewsModal(true);
		setReviewsLoading(true);
		setReviewsPlaceName(place.name);
		setReviews([]);

		try {
			// place.id에서 실제 place ID 추출 (places/로 시작하는 경우)
			const placeId = place.id.startsWith('places/') 
				? place.id 
				: `places/${place.id}`;

			const response = await fetch(`/api/places/reviews?placeId=${encodeURIComponent(placeId)}`);
			
			if (!response.ok) {
				throw new Error('리뷰를 가져오는데 실패했습니다');
			}

			const data = await response.json();
			setReviews(data.reviews || []);
			if (data.placeName) {
				setReviewsPlaceName(data.placeName);
			}
		} catch (error) {
			console.error('리뷰 가져오기 오류:', error);
			setReviews([]);
		} finally {
			setReviewsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-white pb-[65px]'>
			{/* 헤더 */}
			<header className='sticky top-0 z-20 w-full bg-white border-b border-gray-200'>
				<div className='max-w-[700px] mx-auto px-4 py-3'>
					<div className='flex items-center justify-between mb-2'>
						<h1 className='text-lg font-semibold'>
							{scheduleInfo && scheduleInfo.day !== null && scheduleInfo.day !== undefined && scheduleInfo.day < 0
								? '여행 전'
								: '여행 중'}
						</h1>
						<div className='flex items-center gap-3'>
							<button>
								<svg
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'>
									<circle cx='12' cy='12' r='1' />
									<circle cx='12' cy='5' r='1' />
									<circle cx='12' cy='19' r='1' />
								</svg>
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* 위치 및 날씨 배너 */}
			<div
				className='w-full px-4 py-4'
				style={{ backgroundColor: TEAM_MINT }}>
				<div className='max-w-[700px] mx-auto'>
					<div className='flex items-start justify-between text-white'>
						<div className='flex-1'>
							<div className='flex items-center gap-2 mb-1'>
								<svg
									width='16'
									height='16'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'>
									<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
									<circle cx='12' cy='10' r='3' />
								</svg>
								<span className='text-sm'>
									{currentLocation.address}
								</span>
							</div>
							<h2 className='text-xl font-bold mb-1'>
								{currentLocation.name || '위치 정보 없음'}
							</h2>
							{scheduleInfo && scheduleInfo.day !== null && scheduleInfo.day !== undefined && (
								<p className='text-sm opacity-90'>
									{scheduleInfo.day < 0 
										? `여행 ${Math.abs(scheduleInfo.day)}일전` 
										: `여행 ${scheduleInfo.day}일차`}
								</p>
							)}
						</div>
						<div className='text-right'>
							<div className='text-3xl font-bold'>
								{weather.temperature}°C
							</div>
							<div className='text-sm opacity-90'>
								{weather.condition}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 탭 메뉴 */}
			<div className='max-w-[700px] mx-auto px-4 py-3 border-b border-gray-200'>
				<div className='flex gap-2'>
					<button
						onClick={() => setCurrentTab('nearby')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							currentTab === 'nearby'
								? 'bg-gray-100 text-gray-900'
								: 'text-gray-500'
						}`}>
						여행지
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
				<div className='max-w-[700px] mx-auto pb-20'>
					{/* 카테고리 필터 */}
					<div className='px-4 py-4 flex gap-3 overflow-x-auto'>
						{categories.map(category => (
							<button
								key={category}
								onClick={() => {
									setSelectedCategory(category);
									setSearchQuery('');
									setSearchResults([]);
									setShowSearchResults(false);
								}}
								className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
									selectedCategory === category
										? 'bg-[#50B4BE] text-white'
										: 'bg-gray-100 text-gray-700'
								}`}>
								{category}
							</button>
						))}
					</div>

					{/* 검색 입력창 */}
					<div className="px-4 pb-4 relative search-container">
						<div className="relative">
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => handleSearchChange(e.target.value)}
								placeholder="장소를 검색하세요..."
								className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#50B4BE] focus:border-transparent"
							/>
							<svg
								className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2">
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21-4.35-4.35" />
							</svg>
							{isSearching && (
								<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
									<div className="w-5 h-5 border-2 border-[#50B4BE] border-t-transparent rounded-full animate-spin" />
								</div>
							)}
						</div>

						{/* 검색 결과 자동완성 목록 */}
						{showSearchResults && searchResults.length > 0 && (
							<div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
								{searchResults.map((place) => (
									<button
										key={place.id}
										onClick={() => handleSelectSearchResult(place)}
										className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-3">
										<div className="flex-1">
											<div className="font-medium text-gray-900">{place.name}</div>
											{place.description && (
												<div className="text-xs text-gray-500 mt-1">
													{place.description}
												</div>
											)}
											{place.distance !== null && (
												<div className="text-xs text-gray-400 mt-1">
													약 {place.distance}km
												</div>
											)}
										</div>
										{place.rating > 0 && (
											<div className="flex items-center gap-1">
												<svg
													width="12"
													height="12"
													viewBox="0 0 24 24"
													fill="#FCD34D"
													stroke="#FCD34D">
													<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
												</svg>
												<span className="text-xs text-gray-600">{place.rating}</span>
											</div>
										)}
									</button>
								))}
							</div>
						)}
					</div>

					{/* 장소 리스트 */}
					<div className='px-4 space-y-4'>
						{loading ? (
							<div className='text-center py-8 text-gray-500'>
								로딩 중...
							</div>
						) : (searchQuery.trim().length > 0 && searchResults.length > 0) ? (
							// 검색어가 있고 검색 결과가 있으면 검색 결과 표시
							searchResults.map(place => (
								<PlaceCard
									key={place.id}
									place={place}
									onFindRoute={handleFindRoute}
									onAddToSchedule={handleAddToSchedule}
									onViewReviews={handleViewReviews}
									onCopyAddress={handleCopyAddress}
								/>
							))
						) : filteredPlaces.length === 0 ? (
							<div className='text-center py-8 text-gray-500'>
								주변에 장소가 없습니다
							</div>
						) : (
							filteredPlaces.map(place => (
								<PlaceCard
									key={place.id}
									place={place}
									onFindRoute={handleFindRoute}
									onAddToSchedule={handleAddToSchedule}
									onViewReviews={handleViewReviews}
									onCopyAddress={handleCopyAddress}
								/>
							))
						)}
					</div>
				</div>
			)}

			{/* 오늘 일정 탭 */}
			{currentTab === 'schedule' && (
				<div className="max-w-[700px] mx-auto px-4 py-6 pb-20">
					{scheduleLoading ? (
						<div className="text-center py-8 text-gray-500">
							일정을 불러오는 중...
						</div>
					) : todaySchedule.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							오늘 일정이 없습니다
						</div>
					) : (
						<div className="relative">
							{/* 타임라인 */}
							<div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
							
							{/* 일정 목록 */}
							<div className="space-y-4">
								{todaySchedule.map((item, index) => (
									<div key={item.id} className="relative flex items-start gap-4">
										{/* 상태 아이콘 */}
										<div className="relative z-10 flex-shrink-0">
											{item.status === 'completed' && (
												<div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
													<svg
														width="20"
														height="20"
														viewBox="0 0 24 24"
														fill="none"
														stroke="white"
														strokeWidth="3">
														<polyline points="20 6 9 17 4 12" />
													</svg>
												</div>
											)}
											{item.status === 'in-progress' && (
												<div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
													<svg
														width="20"
														height="20"
														viewBox="0 0 24 24"
														fill="none"
														stroke="white"
														strokeWidth="2">
														<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
														<circle cx="12" cy="10" r="3" />
													</svg>
												</div>
											)}
											{item.status === 'upcoming' && (
												<div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
													<svg
														width="20"
														height="20"
														viewBox="0 0 24 24"
														fill="none"
														stroke="white"
														strokeWidth="2">
														<circle cx="12" cy="12" r="10" />
														<polyline points="12 6 12 12 16 14" />
													</svg>
												</div>
											)}
										</div>

										{/* 일정 카드 */}
										<div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<span className="text-sm font-medium text-gray-700">
															{item.time}
														</span>
														{item.status === 'in-progress' && (
															<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
																진행 중
															</span>
														)}
													</div>
													<h3 className="font-semibold text-gray-900 mb-1">
														{item.title}
													</h3>
													<p className="text-sm text-gray-600 mb-2">
														{item.location}
													</p>
													{item.additionalInfo && (
														<div className="flex items-center gap-1 text-xs text-orange-600">
															<svg
																width="14"
																height="14"
																viewBox="0 0 24 24"
																fill="currentColor">
																<path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
															</svg>
															<span>{item.additionalInfo.text}</span>
														</div>
													)}
												</div>

												{/* 액션 버튼 */}
												{item.hasNavigation && (
													<div className="flex items-center gap-2 ml-4">
														<button className="p-2 hover:bg-gray-100 rounded-full">
															<svg
																width="20"
																height="20"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth="2">
																<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
																<circle cx="12" cy="10" r="3" />
															</svg>
														</button>
													</div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
							
							{/* 일정추가하기 버튼 */}
							<div className="mt-6 pb-4">
								<button
									onClick={() => {
										setSelectedPlaceForSchedule(null);
										setShowAddScheduleModal(true);
									}}
									className="w-full py-3 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2"
									style={{ backgroundColor: TEAM_MINT }}>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2">
										<line x1="12" y1="5" x2="12" y2="19" />
										<line x1="5" y1="12" x2="19" y2="12" />
									</svg>
									일정추가하기
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			{/* 최적 동선 탭 */}
			{currentTab === 'route' && (
				<div className='max-w-[700px] mx-auto px-4 py-8 pb-20'>
					<div className='text-center text-gray-500'>
						최적 동선 기능은 준비 중입니다
					</div>
				</div>
			)}

			{/* 리뷰 모달 */}
			{showReviewsModal && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white rounded-t-2xl w-full max-w-[700px] h-[80vh] flex flex-col">
						{/* 모달 헤더 */}
						<div className="flex items-center justify-between p-4 border-b">
							<h2 className="text-lg font-semibold">{reviewsPlaceName} 리뷰</h2>
							<button
								onClick={() => {
									setShowReviewsModal(false);
									setReviews([]);
									setReviewsPlaceName('');
								}}
								className="p-2 hover:bg-gray-100 rounded-full">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2">
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>
						</div>

						{/* 리뷰 목록 */}
						<div className="flex-1 overflow-y-auto p-4">
							{reviewsLoading ? (
								<div className="text-center py-8 text-gray-500">
									리뷰를 불러오는 중...
								</div>
							) : reviews.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									리뷰가 없습니다
								</div>
							) : (
								<div className="space-y-4">
									{reviews.map((review, index) => (
										<div
											key={index}
											className="border-b border-gray-200 pb-4 last:border-b-0">
											<div className="flex items-start justify-between mb-2">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<span className="font-semibold text-gray-900">
															{review.authorName}
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
															<span className="text-xs text-gray-700">
																{review.rating}
															</span>
														</div>
													</div>
													{review.relativePublishTimeDescription && (
														<span className="text-xs text-gray-500">
															{review.relativePublishTimeDescription}
														</span>
													)}
												</div>
											</div>
											<p className="text-sm text-gray-700 mt-2 leading-relaxed">
												{review.text}
											</p>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* 일정추가 모달 */}
			{showAddScheduleModal && (
				<AddScheduleModal
					place={selectedPlaceForSchedule}
					scheduleId={currentScheduleId}
					existingSchedules={todaySchedule}
					onClose={() => {
						setShowAddScheduleModal(false);
						setSelectedPlaceForSchedule(null);
					}}
					onAdd={async (newSchedule) => {
						try {
							// API를 통해 데이터베이스에 저장
							const response = await fetch('/api/today-schedule', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									scheduleId: currentScheduleId,
									time: newSchedule.time,
									title: newSchedule.title,
									location: newSchedule.location,
									datetime: newSchedule.datetime
								})
							});

							if (!response.ok) {
								throw new Error('일정 저장 실패');
							}

							// 저장 성공 시 일정 목록 새로고침
							if (currentTab === 'schedule' && currentScheduleId) {
								const fetchResponse = await fetch(`/api/today-schedule?scheduleId=${currentScheduleId}`);
								if (fetchResponse.ok) {
									const data = await fetchResponse.json();
									const allSchedules = data.schedule || [];
									allSchedules.sort((a, b) => {
										const dateA = a.datetime ? new Date(a.datetime) : new Date();
										const dateB = b.datetime ? new Date(b.datetime) : new Date();
										return dateA - dateB;
									});
									setTodaySchedule(allSchedules);
								}
							}

							setShowAddScheduleModal(false);
							setSelectedPlaceForSchedule(null);
						} catch (error) {
							console.error('일정 저장 오류:', error);
							alert('일정 저장에 실패했습니다. 다시 시도해주세요.');
						}
					}}
				/>
			)}

			{/* 지도 모달 */}
			{showMapModal && selectedPlace && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white rounded-t-2xl w-full max-w-[700px] h-[80vh] flex flex-col">
						{/* 모달 헤더 */}
						<div className="flex items-center justify-between p-4 border-b">
							<h2 className="text-lg font-semibold">{selectedPlace.name}</h2>
							<button
								onClick={() => {
									setShowMapModal(false);
									setSelectedPlace(null);
								}}
								className="p-2 hover:bg-gray-100 rounded-full">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2">
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>
						</div>

						{/* 지도 컨테이너 */}
						<div className="flex-1 relative" ref={mapContainerRef} />

						{/* 하단 정보 */}
						<div className="p-4 border-t bg-gray-50">
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<div
										className="w-4 h-4 rounded-full"
										style={{ backgroundColor: '#50B4BE' }}
									/>
									<span className="text-sm text-gray-700">현재 위치</span>
								</div>
								<div className="flex items-center gap-2">
									<div
										className="w-4 h-4 rounded-full"
										style={{ backgroundColor: '#FF6B6B' }}
									/>
									<span className="text-sm text-gray-700">목적지</span>
								</div>
								<div className="ml-auto text-sm text-gray-500">
									약 {selectedPlace.distance}km
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// 장소 카드 컴포넌트
function PlaceCard({ place, onFindRoute, onAddToSchedule, onViewReviews, onCopyAddress }) {
	return (
		<div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
			<div className='flex'>
				{/* 이미지 */}
				<div className='w-24 h-24 shrink-0 relative'>
					<Image
						src={place.image}
						alt={place.name}
						fill
						className='object-cover'
					/>
				</div>

				{/* 정보 */}
				<div className='flex-1 p-3'>
					<h3 className='font-bold text-gray-900 mb-1'>
						{place.name}
					</h3>
					<div className='flex items-center gap-2 mb-2 flex-wrap'>
						<span
							className='px-2 py-0.5 rounded text-xs font-medium'
							style={{
								backgroundColor: '#E0F2FE',
								color: '#0369A1'
							}}>
							{place.category}
						</span>
						<span className='text-xs text-gray-500'>
							{place.distance}km
						</span>
						<div 
							className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
							onClick={() => onViewReviews && onViewReviews(place)}>
							<svg
								width='12'
								height='12'
								viewBox='0 0 24 24'
								fill='#FCD34D'
								stroke='#FCD34D'>
								<path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
							</svg>
							<span className="text-xs text-gray-700">{place.rating}</span>
							{place.userRatingCount > 0 && (
								<span className="text-xs text-gray-500 ml-1">
									리뷰 {place.userRatingCount.toLocaleString()}개
								</span>
							)}
						</div>
					</div>
					<p 
						className="text-xs text-gray-600 mb-3 underline cursor-pointer hover:text-gray-800 transition-colors"
						onClick={() => place.description && onCopyAddress?.(place.description)}
						title="클릭하여 주소 복사">
						{place.description || '주소 정보 없음'}
					</p>

					{/* 버튼 */}
					<div className='flex gap-2'>
						<button
							onClick={() => onFindRoute(place)}
							className='flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-1'
							style={{ backgroundColor: TEAM_MINT }}>
							<svg
								width='16'
								height='16'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'>
								<polygon points='5 3 19 12 5 21 5 3' />
							</svg>
							길찾기
						</button>
						<button
							onClick={() => onAddToSchedule(place)}
							className='flex-1 px-3 py-2 rounded-lg text-sm font-medium border'
							style={{
								borderColor: TEAM_MINT,
								color: TEAM_MINT,
								backgroundColor: 'white'
							}}>
							일정추가
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

// 일정추가 모달 컴포넌트
function AddScheduleModal({ place, scheduleId, existingSchedules, onClose, onAdd }) {
	const [title, setTitle] = useState(place?.name || '');
	const [location, setLocation] = useState(place?.address || place?.vicinity || '');
	const [hour, setHour] = useState('');
	const [minute, setMinute] = useState('');
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

	const handleSubmit = () => {
		if (!title || !hour || !minute) {
			alert('제목과 시간을 입력해주세요');
			return;
		}

		// 시와 분을 HH:MM 형식으로 변환
		const timeString = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
		
		// 날짜와 시간을 합쳐서 datetime 생성
		const datetime = new Date(`${date}T${timeString}:00`);
		
		const newSchedule = {
			id: `custom-${Date.now()}`,
			type: 'custom',
			time: timeString,
			title: title,
			location: location,
			status: datetime <= new Date() ? 'completed' : 'upcoming',
			hasNavigation: true,
			datetime: datetime.toISOString()
		};

		onAdd(newSchedule);
	};

	return (
		<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-t-2xl w-full max-w-[700px] max-h-[80vh] flex flex-col">
				{/* 모달 헤더 */}
				<div className="flex items-center justify-between p-4 border-b">
					<h2 className="text-lg font-semibold">일정 추가</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-full">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>

				{/* 모달 내용 */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{/* 제목 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							제목 *
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="일정 제목을 입력하세요"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50B4BE]"
						/>
					</div>

					{/* 날짜 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							날짜
						</label>
						<input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50B4BE]"
						/>
					</div>

					{/* 시간 */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							시간 *
						</label>
						<div className="flex items-center gap-2">
							<div className="flex-1 flex items-center gap-2">
								<input
									type="number"
									min="0"
									max="23"
									value={hour}
									onChange={(e) => {
										const value = e.target.value;
										if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 23)) {
											setHour(value);
										}
									}}
									placeholder="00"
									className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50B4BE] text-center"
								/>
								<span className="text-sm text-gray-600">시</span>
							</div>
							<div className="flex-1 flex items-center gap-2">
								<input
									type="number"
									min="0"
									max="59"
									value={minute}
									onChange={(e) => {
										const value = e.target.value;
										if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
											setMinute(value);
										}
									}}
									placeholder="00"
									className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50B4BE] text-center"
								/>
								<span className="text-sm text-gray-600">분</span>
							</div>
						</div>
					</div>

					{/* 기존 일정 표시 (시간 선택 참고용) */}
					{existingSchedules.length > 0 && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								기존 일정
							</label>
							<div className="space-y-2 max-h-40 overflow-y-auto">
								{existingSchedules.map((schedule) => (
									<div
										key={schedule.id}
										className="px-3 py-2 bg-gray-50 rounded-lg text-sm">
										<span className="font-medium">{schedule.time}</span>{' '}
										{schedule.title}
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* 모달 하단 버튼 */}
				<div className="p-4 border-t flex gap-2">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
						취소
					</button>
					<button
						onClick={handleSubmit}
						className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white"
						style={{ backgroundColor: TEAM_MINT }}>
						추가하기
					</button>
				</div>
			</div>
		</div>
	);
}
