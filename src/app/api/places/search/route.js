import { NextResponse } from 'next/server';

export async function POST(req) {
	try {
		const body = await req.json();
		const { query, latitude, longitude } = body;

		if (!query || query.trim().length === 0) {
			return NextResponse.json(
				{ error: '검색어가 필요합니다' },
				{ status: 400 }
			);
		}

		const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
		if (!API_KEY) {
			return NextResponse.json(
				{ error: 'Google API 키가 설정되지 않았습니다' },
				{ status: 500 }
			);
		}

		// Google Places API (Text Search) 사용
		let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}&language=ko`;

		// 위치 정보가 있으면 bias 추가
		if (latitude && longitude) {
			url += `&location=${latitude},${longitude}&radius=50000`;
		}

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error('Google Places API 요청 실패');
		}

		const data = await response.json();

		if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
			console.error('Google Places API 오류:', data.status);
			return NextResponse.json(
				{ error: '장소 검색에 실패했습니다' },
				{ status: 500 }
			);
		}

		// 결과 변환
		const places = (data.results || []).map(place => ({
			id: place.place_id,
			name: place.name,
			location: {
				latitude: place.geometry?.location?.lat,
				longitude: place.geometry?.location?.lng
			},
			address: place.formatted_address,
			rating: place.rating,
			types: place.types
		}));

		return NextResponse.json({
			success: true,
			places: places
		});
	} catch (error) {
		console.error('장소 검색 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}
