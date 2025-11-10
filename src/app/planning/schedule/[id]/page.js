import prisma from '@/share/lib/prisma';
import { MakeBudget, CheckBudget } from './components/Budget';
// import CheckAirTicket from './Components/AirTicket';
import CheckHotel from './components/Hotel';
import CheckTour from './components/Tour';
import GoReservation from './components/GoReservation';
import MainCard from './components/MainCard';
import CountryInfo from './components/CountryInfo';

export default async function schedulePage({ params }) {
	const { id } = await params;
	console.log('id: ', id);

	const schedule = await prisma.schedule.findUnique({
		where: { id },
		include: {
			budgets: true,
			AirTicket: true,
			Hotel: true,
			Tour: true,
			visitCountry: true
		}
	});

	const scheduleId = id;
	const visitCountry = schedule.visitCountry;
	const budget = schedule.budgets;
	const airTicket = schedule.AirTicket;
	const hotel = schedule.Hotel;
	const tour = schedule.Tour;

	console.log('schedule :', schedule);
	console.log('budget :', budget);

	return (
		<div>
			<div className='mb-4'>
				<MainCard visitCountry={visitCountry} />
			</div>
			<div className='px-4 mb-4'>
				<div className='mb-4'>
					<CountryInfo visitCountry={visitCountry} />
				</div>
				<div className='mb-4'>
					<h2 className='text-xl font-bold mb-2'>예산 등록</h2>
					{budget.length === 0 ? (
						<MakeBudget scheduleId={scheduleId} />
					) : (
						<CheckBudget budget={budget} />
					)}
				</div>
				<div className='mb-4'>
					<h2 className='text-xl font-bold mb-2'>
						여행 준비 진행 상황
					</h2>
					<div className='mb-4'>
						{airTicket.length === 0 ? (
							<GoReservation
								title='항공권 예약'
								href={`/planning/schedule/${id}/airline`}
							/>
						) : (
							<CheckAirTicket />
						)}
					</div>
					<div className='mb-4'>
						{hotel.length === 0 ? (
							<GoReservation
								title='숙소 예약'
								href={`/planning/schedule/${id}/hotels`}
							/>
						) : (
							<CheckHotel airTicket={airTicket} />
						)}
					</div>
					<div className='mb-4'>
						{tour.length === 0 ? (
							<GoReservation
								title='관광지 예약'
								href={`/planning/schedule/${id}/tours`}
							/>
						) : (
							<CheckTour tour={tour} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
