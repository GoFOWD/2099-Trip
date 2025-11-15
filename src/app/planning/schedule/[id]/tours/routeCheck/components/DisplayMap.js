'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import getRoute from '../../lib/getRoute';
import RouteMap from './RouteMap';

export default function DisplayMap({ tours }) {
	const [isLoading, setIsLoading] = useState(true);
	const [travelMode, setTravelMode] = useState('WALK');
	const [optimalRoute, setOptimalRoute] = useState(null);
	const searchParams = useSearchParams();
	const { id } = useParams();
	const router = useRouter();
	// 'TRANSIT' 대중교통
	// 'DRIVE' 자동차
	// 'TWO_WHEELER' 오토바이
	// 'WALK' 도보
	// 'BICYCLE' 자전거
	useEffect(() => {
		setIsLoading(true);
		async function getoptimalRoute(tours, travelMode) {
			const res = await getRoute(tours, travelMode);
			setOptimalRoute(res);
			setIsLoading(false);
		}
		getoptimalRoute(tours, travelMode);
	}, [travelMode]);

	if (isLoading) return '로딩중';

	const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY2;
	const placeNames = searchParams.getAll('placeName');
	const tourInfo = tours.map(tour => ({
		date: tour.reservedAt || null,
		latitude: tour.latitude || null,
		longitude: tour.longitude || null
	}));

	const spots = [...tourInfo];
	const sortedSpots = [...spots].sort((a, b) => a.date - b.date);
	const geoSpots = sortedSpots.map(spot => ({
		lat: spot.latitude,
		lng: spot.longitude
	}));
	const deletedNull = geoSpots.filter(geo => geo.lat !== null);
	const mapSpots = deletedNull.map((spot, i) => ({
		...spot,
		name: placeNames[i]
	}));

	return (
		<div>
			<div className='px-4 mb-4'>
				<p className='mb-1 font-semibold'>이동 수단</p>
				<div className='flex justify-between'>
					<button
						className={`px-3 py-1 rounded-full text-sm text-white ${
							travelMode === 'WALK'
								? 'bg-(--brandColor)'
								: 'bg-(--brandColor)/60'
						}`}
						onClick={() => setTravelMode('WALK')}>
						도보
					</button>
					<button
						className={`px-3 py-1 rounded-full text-sm text-white ${
							travelMode === 'TRANSIT'
								? 'bg-(--brandColor)'
								: 'bg-(--brandColor)/60'
						}`}
						onClick={() => setTravelMode('TRANSIT')}>
						대중교통
					</button>
					<button
						className={`px-3 py-1 rounded-full text-sm text-white ${
							travelMode === 'DRIVE'
								? 'bg-(--brandColor)'
								: 'bg-(--brandColor)/60'
						}`}
						onClick={() => setTravelMode('DRIVE')}>
						자동차
					</button>
					<button
						className={`px-3 py-1 rounded-full text-sm text-white ${
							travelMode === 'TWO_WHEELER'
								? 'bg-(--brandColor)'
								: 'bg-(--brandColor)/60'
						}`}
						onClick={() => setTravelMode('TWO_WHEELER')}>
						오토바이
					</button>
					<button
						className={`px-3 py-1 rounded-full text-sm text-white ${
							travelMode === 'BICYCLE'
								? 'bg-(--brandColor)'
								: 'bg-(--brandColor)/60'
						}`}
						onClick={() => setTravelMode('BICYCLE')}>
						자전거
					</button>
				</div>
			</div>
			<div className='px-4'>
				{travelMode === 'TRANSIT' && Array.isArray(optimalRoute) ? (
					// 🚩구간별로 RouteMap을 여러 번 그리기(1→2, 2→3 등)
					optimalRoute.map((segmentRoute, idx) => (
						<div key={idx} className='mb-8'>
							<h3 className='text-base font-bold mb-2'>
								{mapSpots[idx].name} → {mapSpots[idx + 1]?.name}
							</h3>
							<RouteMap
								routeData={segmentRoute} // 각 구간별 경로 결과
								spots={[mapSpots[idx], mapSpots[idx + 1]]} // 출발,도착
								apiKey={API_KEY}
								travelMode={travelMode}
							/>
						</div>
					))
				) : (
					<RouteMap
						routeData={optimalRoute}
						spots={mapSpots}
						apiKey={API_KEY}
						travelMode={travelMode}
					/>
				)}
			</div>
			<div className='px-4 flex justify-between gap-5'>
				<button
					className='flex-1 px-4 py-4 rounded-lg bg-white border border-[#F3F4F6]'
					onClick={() =>
						router.push(`/planning/schedule/${id}/tour`)
					}>
					일정 다시 선택하기
				</button>
				<button
					className='flex-1 px-4 py-3 bg-(--brandColor) text-white rounded-lg'
					onClick={() => router.push(`/planning/schedule/${id}`)}>
					확인
				</button>
			</div>
		</div>
	);
}
