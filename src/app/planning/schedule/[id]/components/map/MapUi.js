'use client';
import { useMemo } from 'react';
import {
	GoogleMap,
	LoadScript,
	Polyline,
	Marker,
} from '@react-google-maps/api';
import { decode } from '@googlemaps/polyline-codec';

const containerStyle = {
	width: '100%',
	height: '400px',
};

export default function MapUi({ optimizedroute }) {
	if (!optimizedroute) {
		return (
			<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={{ lat: 37.5665, lng: 126.978 }} // Default center (e.g., Seoul)
					zoom={10}
				/>
			</LoadScript>
		);
	}

	const { overview_polyline, legs } = optimizedroute;

	const path = useMemo(() => {
		if (!overview_polyline) return [];
		return decode(overview_polyline.points).map(([lat, lng]) => ({ lat, lng }));
	}, [overview_polyline]);

	const spots = useMemo(() => {
		if (!legs || legs.length === 0) return [];
		// The first spot is the start_location of the first leg.
		// Subsequent spots are the end_locations of each leg in order.
		const firstSpot = legs[0].start_location;
		const otherSpots = legs.map(leg => leg.end_location);
		return [firstSpot, ...otherSpots];
	}, [legs]);

	const onLoad = map => {
		if (path.length === 0 && spots.length === 0) return;

		const bounds = new window.google.maps.LatLngBounds();
		path.forEach(p => bounds.extend(p));
		spots.forEach(s => bounds.extend(s));
		map.fitBounds(bounds);
	};

	return (
		<LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
			<GoogleMap mapContainerStyle={containerStyle} onLoad={onLoad}>
				{path.length > 0 && (
					<Polyline
						path={path}
						options={{
							strokeColor: '#2673FF',
							strokeWeight: 4,
						}}
					/>
				)}
				{spots.map((spot, idx) => (
					<Marker
						key={idx}
						position={{ lat: spot.lat, lng: spot.lng }}
						label={(idx + 1).toString()}
					/>
				))}
			</GoogleMap>
		</LoadScript>
	);
}
