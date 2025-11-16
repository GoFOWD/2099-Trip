import prisma from '@/share/lib/prisma';
import CheckAirTicket from '../components/CheckAirTicket';
import GoReservation from '../components/GoReservation';

export default async function AirInfo({ id }) {
	const schedule = await prisma.schedule.findUnique({
		where: { id },
		include: {
			AirTicket: true
		}
	});
	const airTicket = schedule.AirTicket;
	return (
		<div className='mb-4'>
			{airTicket.length === 0 ? (
				<GoReservation
					title='항공권'
					href={`/planning/schedule/${id}/airline`}
					src='/airRes.svg'
				/>
			) : (
				<CheckAirTicket />
			)}
		</div>
	);
}
