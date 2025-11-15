export default async function getAddress(lat, lng) {
	const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY2;
	const res = await fetch(
		`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
	);
	const data = await res.json();
	// 결과 배열이 존재하면서 주소가 있으면 반환
	if (
		data.results &&
		data.results.length > 0 &&
		data.results[0].formatted_address
	) {
		return data.results[0].formatted_address;
	} else {
		return null; // 실패 시 null 반환
	}
}
