export default async function getAddressKo(lat, lng) {
	const API_KEY = process.env.GOOGLE_API_KEY;

	const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=${API_KEY}`;

	const res = await fetch(url);
	const data = await res.json();

	const components = data.results[0].address_components;

	// 행정단위 추출
	const area1 =
		components.find(c => c.types.includes('administrative_area_level_1'))
			?.long_name || '';
	const area2 =
		components.find(
			c =>
				c.types.includes('sublocality_level_1') ||
				c.types.includes('administrative_area_level_2')
		)?.long_name || '';
	const area3 =
		components.find(
			c =>
				c.types.includes('sublocality_level_2') ||
				c.types.includes('locality')
		)?.long_name || '';

	let address = [area1, area2].filter(Boolean).join(' ');

	address = [area1, area2, area3].filter(Boolean).join(' ');

	return address;
}
