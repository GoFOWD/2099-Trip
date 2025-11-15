import getAddress from './getAddress';

export default async function getRoute(tours, travelMode) {
	// 1. 좌표 유효값만 날짜순 정렬
	const sortedSpots = tours
		.filter(tour => tour.latitude && tour.longitude)
		.sort((a, b) => (a.reservedAt || 0) - (b.reservedAt || 0));
	const spots = sortedSpots.map(({ latitude, longitude }) => ({
		latitude,
		longitude
	}));

	// 대중교통 (TRANSIT)만 departureTime/관련 옵션 추가
	if (travelMode === 'TRANSIT' && spots.length > 1) {
		const now = new Date();
		now.setHours(now.getHours() + 2);
		const departureTime = now.toISOString();

		const segmentResults = [];
		for (let i = 0; i < spots.length - 1; i++) {
			const originGeo = spots[i];
			const destinationGeo = spots[i + 1];

			const body = {
				origin: { location: { latLng: originGeo } },
				destination: { location: { latLng: destinationGeo } },
				travelMode: 'TRANSIT',
				departureTime,
				computeAlternativeRoutes: true
			};

			try {
				const routesRes = await fetch(
					'https://routes.googleapis.com/directions/v2:computeRoutes',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-Goog-Api-Key':
								process.env.NEXT_PUBLIC_GOOGLE_API_KEY2,
							// 대중교통에만 transitDetails, transitFare 포함!
							'X-Goog-FieldMask': [
								'routes.legs.steps.travelMode',
								'routes.legs.steps.transitDetails',
								'routes.legs.steps.polyline',
								'routes.legs.steps.startLocation',
								'routes.legs.steps.endLocation',
								'routes.legs.distanceMeters',
								'routes.legs.duration',
								'routes.travelAdvisory.transitFare',
								'routes.polyline.encodedPolyline'
							].join(',')
						},
						body: JSON.stringify(body)
					}
				);
				const routesData = await routesRes.json();
				console.log(routesData);
				segmentResults.push(routesData);
			} catch (error) {
				console.error('[구글 대중교통 경로 요청 실패]', error);
				segmentResults.push({ error: error.message || error });
			}
		}
		return segmentResults;
	}

	// 🚩 자동차/도보/오토바이/자전거: departureTime 및 대중교통 관련 필드 완전히 제거!
	else if (spots.length > 1) {
		const origin = spots[0];
		const destination = spots[spots.length - 1];
		const waypoints = spots.slice(1, -1);

		const body = {
			origin: { location: { latLng: origin } },
			destination: { location: { latLng: destination } },
			travelMode: travelMode
		};
		if (waypoints.length > 0) {
			body.intermediates = waypoints.map(wp => ({
				location: { latLng: wp }
			}));
		}

		try {
			const routesRes = await fetch(
				'https://routes.googleapis.com/directions/v2:computeRoutes',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Goog-Api-Key':
							process.env.NEXT_PUBLIC_GOOGLE_API_KEY2,
						'X-Goog-FieldMask': [
							'routes.legs.steps.travelMode',
							'routes.legs.steps.polyline',
							'routes.legs.steps.startLocation',
							'routes.legs.steps.endLocation',
							'routes.legs.distanceMeters',
							'routes.legs.duration',
							'routes.polyline.encodedPolyline'
						].join(',')
					},
					body: JSON.stringify(body)
				}
			);
			return await routesRes.json();
		} catch (error) {
			console.error('[구글 자동차/도보 경로 요청 실패]', error);
			return { error: error.message || error };
		}
	}
	// 유효한 위치 2개 미만
	else {
		return { error: '유효한 위치가 두 개 이상이어야 경로 계산 가능' };
	}
}
