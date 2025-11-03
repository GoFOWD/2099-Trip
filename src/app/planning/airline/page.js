'use client';
import { useState } from 'react';

// ✅ 공용 컴포넌트
import Header from '@/share/ui/Header';
import ProgressBar from '@/share/ui/ProgressBar';
import FooterNav from '@/share/ui/FooterNav';

// ✅ flights 전용 컴포넌트
import TravelCard from './components/TravelCard';
import SearchForm from './components/SearchForm';
import SortOptions from './components/SortOptions';
import FlightCard from './components/FlightCard';
import FlightDetailModal from './modals/FlightDetailModal';
import { sampleResults } from './components/utils/sampleResults';

export default function FlightsPage() {
	const [results] = useState(sampleResults());
	const [selected, setSelected] = useState(null);

	return (
		<div className='min-h-screen bg-[var(--subColor)] text-slate-900 pb-20'>
			<Header>
				<ProgressBar step={6} total={10} />
				<TravelCard
					destination='파리, 프랑스'
					startDate='2025-10-01'
					endDate='2025-10-09'
					budget='80만원'
				/>
			</Header>

			<main className='max-w-3xl mx-auto p-4 space-y-4'>
				<SearchForm onSearch={data => console.log('search', data)} />
				<SortOptions onChange={type => console.log('정렬:', type)} />
				{results.map(r => (
					<FlightCard key={r.id} flight={r} onDetail={setSelected} />
				))}
			</main>

			<FooterNav />
			{selected && (
				<FlightDetailModal
					flight={selected}
					onClose={() => setSelected(null)}
				/>
			)}
		</div>
	);
}
