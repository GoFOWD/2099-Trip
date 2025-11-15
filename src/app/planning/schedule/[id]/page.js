import prisma from '@/share/lib/prisma';
import { MakeBudget, CheckBudget } from './components/Budget';
import CheckAirTicket from './components/CheckAirTicket';
import CheckHotel from './components/Hotel';
import CheckTour from './components/CheckTour';
import GoReservation from './components/GoReservation';
import MainCard from './components/MainCard';
import CountryInfo from './components/CountryInfo';

export default async function schedulePage({ params }) {
	const { id } = await params;
	console.log(id);

	const schedule = await prisma.schedule.findUnique({
		where: { id },
		include: {
			budgets: true,
			AirTicket: true,
			Hotel: true,
			Tour: true,
			visitCountry: true,
			city: true
		}
	});

	const scheduleId = id;
	const visitCountry = schedule.visitCountry;
	const city = schedule.city;
	const budget = schedule.budgets;
	const airTicket = schedule.AirTicket;
	const hotel = schedule.Hotel;
	const tours = schedule.Tour;

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
								title='항공권'
								href={`/planning/schedule/${id}/airline`}
								src='/airRes.svg'
							/>
						) : (
							<CheckAirTicket />
						)}
					</div>
					<div className='mb-4'>
						{hotel.length === 0 ? (
							<GoReservation
								title='숙소'
								href={`/planning/schedule/${id}/hotels`}
								src='/hotelRes.svg'
							/>
						) : (
							<CheckHotel airTicket={airTicket} />
						)}
					</div>
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
