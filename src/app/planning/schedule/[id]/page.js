import prisma from '@/share/lib/prisma';
import MainCard from './components/MainCard';
import CountryInfo from './components/CountryInfo';
import AirInfo from './serverComponents/AirInfo';
import TourInfo from './serverComponents/TourInfo';
import HotelInfo from './serverComponents/HotelInfo';
import BudgetInfo from './serverComponents/BudgetInfo';
import { Suspense } from 'react';
import Skeleton from '@/share/ui/Skeleton';

export default async function schedulePage({ params }) {
	const { id } = await params;

	const schedule = await prisma.schedule.findUnique({
		where: { id },
		include: {
			visitCountry: true,
			city: true
		}
	});

	const visitCountry = schedule.visitCountry;
	const city = schedule.city;

	return (
		<div className='pb-[65px]'>
			<div className='mb-4'>
				<MainCard visitCountry={visitCountry} city={city} />
			</div>
			<div className='px-4 mb-4'>
				<div className='mb-4'>
					<CountryInfo visitCountry={visitCountry} />
				</div>
				<div className='mb-4'>
					<h2 className='text-xl font-bold mb-2'>예산</h2>
					<Suspense fallback={<Skeleton />}>
						<BudgetInfo id={id} />
					</Suspense>
				</div>
				<div className='mb-4'>
					<h2 className='text-xl font-bold mb-2'>
						여행 준비 진행 상황
					</h2>
					<Suspense fallback={<Skeleton />}>
						<AirInfo id={id} />
					</Suspense>
					<Suspense fallback={<Skeleton />}>
						<HotelInfo id={id} />
					</Suspense>
					<Suspense fallback={<Skeleton />}>
						<TourInfo id={id} />
					</Suspense>
				</div>
				<div className='mb-4'>
					<h2 className='text-xl font-bold mb-2'>
						준비물 체크 리스트
					</h2>
				</div>
			</div>
		</div>
	);
}
