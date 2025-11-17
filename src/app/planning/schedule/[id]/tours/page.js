import prisma from '@/share/lib/prisma';
import Tours from './serverComponents/Tours';
import { Suspense } from 'react';
import Skeleton from '@/share/ui/Skeleton';

export default async function tourPage({ params }) {
	const { id } = await params;
	const scheduleId = id;

	const schedule = await prisma.schedule.findUnique({
		where: { id: scheduleId },
		select: {
			city: {
				select: {
					cityName: true,
					cityCode: true
				}
			}
		}
	});

	const cityName = schedule.city.cityName;

	return (
		<div className='pb-[65px]'>
			<div className='flex flex-col items-center pt-3 mb-4 mt-4'>
				<h1 className='font-bold text-2xl mb-2'>
					구경할 곳을 골라봐요 📷
				</h1>
				<p className='text-[#4B5563] text-sm'>
					{cityName}에서 즐길 수 있는 다양한 관광지를 골라보세요
				</p>
			</div>
			<div>
				<Suspense fallback={<Skeleton />}>
					<Tours cityName={cityName} />
				</Suspense>
				{/* <DisplayTour details={allPlaceDetails} /> */}
			</div>
		</div>
	);
}
