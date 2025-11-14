export async function geturl(photoName) {
	const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
	if (!photoName || !GOOGLE_API_KEY) return null;
	return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=800&key=${GOOGLE_API_KEY}`;
}
