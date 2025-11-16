import prisma from '@/share/lib/prisma';
import GoReservation from '../components/GoReservation';
import CheckHotel from '../components/Hotel';

export default async function HotelInfo({ id }) {
	const schedule = await prisma.schedule.findUnique({
		where: { id },
		include: {
			Hotel: true
		}
	});
	const hotel = schedule.Hotel;
	return (
		<div className='mb-4'>
			{hotel.length === 0 ? (
				<GoReservation
					title='숙소'
					href={`/planning/schedule/${id}/hotels`}
					src='/hotelRes.svg'
				/>
			) : (
				<CheckHotel hotel={hotel} />
			)}
		</div>
	);
}
