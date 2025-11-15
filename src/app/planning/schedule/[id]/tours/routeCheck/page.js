import prisma from '@/share/lib/prisma';
import getRoute from '../lib/getRoute';
import DisplayMap from './components/DisplayMap';

export default async function routeCheckPage({ params }) {
	const { id } = await params;
	const schedule = await prisma.schedule.findUnique({
		where: { id },
		include: {
			Tour: true
		}
	});
	const tours = schedule.Tour;

	return (
		<div className='pb-[65px]'>
			<div className='flex flex-col items-center pt-3 mb-4 mt-4'>
				<h1 className='font-bold text-2xl mb-2'>
					동선을 확인해 보세요 🗺️
				</h1>
				<p className='text-[#4B5563] text-sm'>
					이동수단별 소요시간을 확인해 보세요
				</p>
			</div>
			<div className='mb-4'>
				<DisplayMap tours={tours} />
			</div>
		</div>
	);
}
