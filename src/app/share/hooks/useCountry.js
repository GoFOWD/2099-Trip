'use client';
import { useState, useCallback } from 'react';

export function useCountry() {
	const [country, setCountry] = useState(null);
	const [error, setError] = useState(null);

	const detectCountry = useCallback(() => {
		if (!navigator.geolocation) {
			setError('브라우저에서 geolocation 지원 안함');
			return;
		}

		navigator.geolocation.getCurrentPosition(
			async pos => {
				const { latitude, longitude } = pos.coords;
				try {
					const res = await fetch(
						`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
					);
					const data = await res.json();
					setCountry(
						(data.address && data.address.country_code) || 'unknown'
					);
				} catch (e) {
					setError(String(e));
				}
			},
			err => setError(err.message)
		);
	}, []);

	return { country, error, detectCountry };
}
