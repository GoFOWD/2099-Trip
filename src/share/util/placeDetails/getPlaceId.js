export default async function getPlaceId(placeName) {
	try {
		if (!placeName) throw new Error('장소 이름을 입력해야 합니다.');

		const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
		if (!GOOGLE_API_KEY)
			throw new Error('Google API 키가 설정되지 않았습니다.');

		const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
		const searchBody = JSON.stringify({
			textQuery: placeName
		});

		const searchRes = await fetch(searchUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Goog-Api-Key': GOOGLE_API_KEY,
				'X-Goog-FieldMask': 'places.id'
			},
			body: searchBody
		});

		if (!searchRes.ok) throw new Error('장소 검색 실패');

		const places = await searchRes.json();

		return places.places;
	} catch (error) {
		console.error(error);
		throw new Error('네트워크 오류');
	}
}
