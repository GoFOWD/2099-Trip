import prisma from '@/share/lib/prisma';
import CheckTour from '../components/CheckTour';
import GoReservation from '../components/GoReservation';

export default async function TourInfo({ id }) {
	const schedule = await prisma.schedule.findUnique({
		where: { id },
		include: {
			Tour: true
		}
	});
	const tours = schedule.Tour;
	return (
		<div className='mb-4'>
			{tours.length === 0 ? (
				<GoReservation
					title='관광지'
					href={`/planning/schedule/${id}/tours`}
					src='/tourRes.svg'
				/>
			) : (
				<CheckTour tours={tours} id={id} />
			)}
		</div>
	);
}
