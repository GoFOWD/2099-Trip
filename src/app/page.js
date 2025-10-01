'use client';
import ExchDisplay from './feature/ExchDisplay';
import PlaceImg from './share/ui/PlaceImg';

export default function Home() {
	return (
		<>
			<ExchDisplay />
			<PlaceImg searchValue='롯데월드' width={500} height={500} />
		</>
	);
}
