import React from 'react';
import {
	GoogleMap,
	Polyline,
	Marker,
	useLoadScript
} from '@react-google-maps/api';
import { decode } from '@googlemaps/polyline-codec';

// 시간 표시 변환
function formatSeconds(seconds) {
	if (!seconds) return '-';
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	if (h && m) return `${h}시간 ${m}분`;
	if (h) return `${h}시간`;
	if (m) return `${m}분`;
	return `${seconds}초`;
}

// 이동수단 한글화
function korMode(mode) {
	switch (mode) {
		case 'WALK':
			return '도보';
		case 'DRIVE':
			return '자동차';
		case 'TWO_WHEELER':
			return '오토바이';
		case 'TRANSIT':
			return '대중교통';
		case 'BICYCLE':
			return '자전거';
		default:
			return mode;
	}
}

// 각 단계별 대중교통 안내
function renderTransitSteps(steps = []) {
	return (
		<ul className='mt-2 pl-2 text-sm space-y-1'>
			{steps.map((step, idx) => {
				if (step.travelMode === 'WALK')
					return (
						<li
							key={idx}
							className='border-l-2 border-gray-200 pl-2'>
							🚶 <b>도보</b>{' '}
							{step.distanceMeters &&
								(step.distanceMeters / 1000).toFixed(2)}{' '}
							km
							{step.duration &&
								`, ${formatSeconds(parseInt(step.duration))}`}
						</li>
					);
				if (step.travelMode === 'TRANSIT' && step.transitDetails)
					return (
						<li
							key={idx}
							className='border-l-2 border-yellow-200 pl-2'>
							🚌{' '}
							<b>
								{step.transitDetails.transitLine?.name ||
									'노선명 없음'}
							</b>
							<span className='text-xs text-gray-500 ml-1'>
								(
								{step.transitDetails.transitLine?.vehicle
									?.type || '종류 미상'}
								)
							</span>
							<br />- 탑승:{' '}
							{step.transitDetails.departureStop?.name ||
								'정보 없음'}
							<br />- 하차:{' '}
							{step.transitDetails.arrivalStop?.name ||
								'정보 없음'}
							<br />- {step.transitDetails.numStops} 정거장
							{step.distanceMeters &&
								`, ${(step.distanceMeters / 1000).toFixed(
									2
								)} km`}
							{step.duration &&
								`, ${formatSeconds(parseInt(step.duration))}`}
						</li>
					);
				return (
					<li key={idx} className='border-l-2 border-gray-200 pl-2'>
						<span>구간 정보 없음</span>
					</li>
				);
			})}
		</ul>
	);
}

export default function RouteMap({ routeData, spots, apiKey, travelMode }) {
	// 구글맵 API 로드 상태
	const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });
	if (!isLoaded)
		return <div className='text-center py-10'>지도 불러오는 중...</div>;

	// 응답의 안전한 추출
	const routeObj =
		routeData &&
		routeData.routes &&
		Array.isArray(routeData.routes) &&
		routeData.routes[0];

	// 다중 경로를 위한 legs 배열 (자동차 등), 대중교통은 1구간
	const legObjs =
		routeObj &&
		routeObj.legs &&
		Array.isArray(routeObj.legs) &&
		routeObj.legs.length > 0
			? routeObj.legs
			: [];

	// 폴리라인
	const encodedPolyline = routeObj?.polyline?.encodedPolyline;
	const path = encodedPolyline
		? decode(encodedPolyline).map(([lat, lng]) => ({ lat, lng }))
		: [];

	// 지도 중심
	const center = spots?.[0] || { lat: 37.5665, lng: 126.978 };
	// 선/마커 색상
	const polyColor =
		travelMode === 'DRIVE'
			? '#4285F4'
			: travelMode === 'WALK'
			? '#34A853'
			: travelMode === 'TRANSIT'
			? '#F9AB00'
			: '#D81B60';

	return (
		<div className='grid md:grid-cols-2 gap-6'>
			{/* 지도 */}
			<div className='rounded-lg overflow-hidden shadow-lg h-[400px] bg-gray-100'>
				{routeObj && path.length > 1 ? (
					<GoogleMap
						center={center}
						zoom={12}
						mapContainerStyle={{ width: '100%', height: '100%' }}>
						<Polyline
							path={path}
							options={{
								strokeColor: polyColor,
								strokeWeight: 5
							}}
						/>
						{spots.map((spot, idx) => (
							<Marker
								key={idx}
								position={{ lat: spot.lat, lng: spot.lng }}
								label={{
									text: String(idx + 1),
									color: 'white',
									fontWeight: 'bold'
								}}
							/>
						))}
					</GoogleMap>
				) : (
					<div className='flex items-center justify-center h-full text-lg text-(--brandColor) font-bold'>
						경로 정보가 없습니다.
					</div>
				)}
			</div>

			{/* 상세 정보(카드) */}
			<div>
				<h2 className='font-bold text-lg mb-4'>
					{korMode(travelMode)} 기준 경로 상세
				</h2>
				{/* 대중교통 렌더링 */}
				{travelMode === 'TRANSIT' ? (
					legObjs[0] &&
					Array.isArray(legObjs[0].steps) &&
					legObjs[0].steps.length > 0 ? (
						<div className='space-y-4'>
							{renderTransitSteps(legObjs[0].steps)}
							{/* 요금 정보 */}
							{routeObj?.travelAdvisory?.transitFare && (
								<div className='pt-2 text-blue-800'>
									예상 요금:{' '}
									{routeObj.travelAdvisory.transitFare.units}{' '}
									{
										routeObj.travelAdvisory.transitFare
											.currencyCode
									}
								</div>
							)}
						</div>
					) : (
						<div className='text-(--brandColor) font-bold py-8 text-center'>
							이 구간은 구글 데이터 기준 대중교통 경로가 존재하지
							않습니다.
						</div>
					)
				) : // 기타(자동차/도보 등)
				legObjs.length > 0 ? (
					legObjs.map((leg, idx) => (
						<div
							key={idx}
							className='bg-white rounded-lg p-4 shadow mb-4'>
							<div className='font-semibold mb-2'>
								{spots[idx]?.name} → {spots[idx + 1]?.name}
							</div>
							<div className='text-gray-700'>
								거리:{' '}
								{leg.distanceMeters
									? (leg.distanceMeters / 1000).toFixed(2)
									: '-'}{' '}
								km
								<br />
								소요시간:{' '}
								{leg.duration
									? formatSeconds(parseInt(leg.duration))
									: '-'}
								<br />
								도로 정보: {leg.description || '정보 없음'}
							</div>
						</div>
					))
				) : (
					<div className='text-(--brandColor) font-bold py-8 text-center'>
						해당 이동수단의 경로가 없습니다.
					</div>
				)}
			</div>
		</div>
	);
}
