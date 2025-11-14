import DeleteSchedule from './DeleteSchedule';

export default function MainCard({ visitCountry, city }) {
	const countryName = visitCountry[0].nameKo;
	const startDay = visitCountry[0].startDate;
	const startYear = startDay.getFullYear();
	const startMonth = startDay.getMonth() + 1;
	const startD = startDay.getDate();
	const endDay = visitCountry[0].endDate;
	const endYear = endDay.getFullYear();
	const endMonth = endDay.getMonth() + 1;
	const endD = endDay.getDate();
	const cityName = city.cityName;

	const today = new Date();
	const dDay = Math.ceil((startDay - today) / (1000 * 60 * 60 * 24));

	const formattedDate = `${startYear}.${startMonth}.${startD} - ${endYear}.${endMonth}.${endD}`;

	return (
		<div className='w-full h-40 bg-(--brandColor) px-4 py-4 flex flex-col justify-center'>
			<p className='text-sm text-white font-semibold mb-2'>
				{cityName}, {countryName} 여행
			</p>
			<h1 className='text-2xl text-white font-bold mb-2'>
				두근두근, 여행 D-{dDay}
			</h1>
			<div className='flex justify-between'>
				<p className='bg-[#508B91] px-3 py-2 flex items-center text-white text-sm w-fit rounded-full'>
					{formattedDate}
				</p>
				<DeleteSchedule />
			</div>
		</div>
	);
}
