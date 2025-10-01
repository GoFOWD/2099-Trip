export async function getPhotosUrl(placeName) {
	if (!placeName) throw new Error('장소 이름을 입력해야 합니다.');

	const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
	if (!GOOGLE_API_KEY)
		throw new Error('Google API 키가 설정되지 않았습니다.');

	// 1. 호텔 검색 (Text Search)
	const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
	const searchBody = JSON.stringify({
		textQuery: placeName
	});

	const searchRes = await fetch(searchUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Goog-Api-Key': GOOGLE_API_KEY,
			'X-Goog-FieldMask': 'places.photos,places.displayName'
		},
		body: searchBody
	});

	if (!searchRes.ok) throw new Error('호텔 검색 실패');

	const searchData = await searchRes.json();

	if (!searchData.places || searchData.places.length === 0) {
		console.log(
			`[사진 검색 실패] '${placeName}'에 대한 검색 결과가 없습니다.`
		);
		return null;
	}

	const hotel = searchData.places[0];
	const photoName = hotel.photos?.[0]?.name;

	if (!photoName) {
		console.log(
			`[사진 검색 실패] '${hotel.displayName}' 장소는 찾았지만, 연관된 사진이 없습니다.`
		);
		return null;
	}

	// 2. 사진 URL 생성
	const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${GOOGLE_API_KEY}`;

	console.log('[사진 검색 성공] 생성된 URL:', photoUrl);
	return photoUrl;
}
