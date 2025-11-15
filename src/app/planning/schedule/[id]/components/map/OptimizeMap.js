import { apicodeToName } from '../../airline/data/airports';
import getPlaceGeo from '@/share/util/placeDetails/getPlaceGeo';
import MapUi from './MapUi';

const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

export default async function OptimizeMap({ tours, airTicket, hotel }) {
	async function getOptimizedRoute(spots) {
		const origin = spots[0];
		const destination = spots[spots.length - 1];
		const waypoints = spots.slice(1, -1);

		const res = await client.directions({
			params: {
				origin: `${origin.lat},${origin.lng}`,
				destination: `${destination.lat},${destination.lng}`,
				waypoints: waypoints.map(wp => `${wp.lat},${wp.lng}`),
				optimize: true,
				key: process.env.GOOGLE_API_KEY
			}
		});

		// 반환값: 각 경유지의 최적 순서, 경로 폴리라인 등 포함
		return res.data.routes[0];
	}
	const airportCode = airTicket?.segment?.airportName || null;
	const airportName =
		apicodeToName?.find(e => e.code === airportCode) || null;

	let airportGeo = null;
	if (airportName) {
		airportGeo = (await getPlaceGeo(airportName)) || null;
	}

	const airInfo = {
		date: airTicket?.segment?.arrivalDate || null,
		latitude: airportGeo?.location?.latitude || null,
		longitude: airportGeo?.location?.longitude || null
	};

	const tourInfo = tours.map(tour => ({
		date: tour.reservedAt || null,
		latitude: tour.latitude || null,
		longitude: tour.longitude || null
	}));

	const spots = [...tourInfo, airInfo];
	const sortedSpots = [...spots].sort((a, b) => a.date - b.date);
	const geoSpots = sortedSpots.map(spot => ({
		lat: spot.latitude,
		lng: spot.longitude
	}));
	const deletedNull = geoSpots.filter(geo => geo.lat !== null);

	const avgLat =
		deletedNull.reduce((sum, s) => sum + s.lat, 0) / deletedNull.length;
	const avgLng =
		deletedNull.reduce((sum, s) => sum + s.lng, 0) / deletedNull.length;

	const center = { lat: avgLat, lng: avgLng };

	const optimizedroute = await getOptimizedRoute(deletedNull);

	// const tourInfo = {
	// 	date: tour.reservedAt || null,
	// 	latitude: tour.latitude || null,
	// 	longitude: tour.longitude || null
	// };

	return <MapUi optimizedroute={optimizedroute} center={center} />;
}
