'use client';
import { useCountry } from '../share/hooks/useCountry';

export default function UserCountry() {
	const { country, error, detectCountry } = useCountry();

	return (
		<div>
			<button onClick={detectCountry}>국가 감지</button>
			{country && <p>나라 코드: {country.toUpperCase()}</p>}
			{error && <p>에러: {error}</p>}
		</div>
	);
}
