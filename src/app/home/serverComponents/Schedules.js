import Schedule from '../components/schedule';
import Link from 'next/link';

export default async function Schedules({ user }) {
	const userSchedules = await prisma.schedule.findMany({
		where: {
			userId: user.id
		},
		include: {
			visitCountry: true,
			city: true
		}
	});

	console.log(userSchedules);

	const schedules = await Promise.all(
		userSchedules.map(async userSchedule => {
			const visitCountry = userSchedule.visitCountry[0];
			const countryName = visitCountry.nameKo;
			const cityName = userSchedule.city.cityName;

			// fetch 요청 후 JSON 파싱
			const res = await fetch(
				`http://localhost:3000/api/flag?country=${countryName}`
			);

			const data = await res.json();
			const flagUrl = data.url; // API에서 반환하는 실제 URL 필드

			// 기존 userSchedule에 countryName, flagUrl 추가
			return { ...userSchedule, countryName, flagUrl, cityName };
		})
	);

	return (
		<div>
			{schedules.map(schedule => (
				<Link
					key={schedule.id}
					href={`/planning/schedule/${schedule.id}`}>
					<Schedule
						startDay={schedule.startDate}
						endDay={schedule.endDate}
						country={schedule.countryName}
						flagUrl={schedule.flagUrl}
						cityName={schedule.cityName}
					/>
				</Link>
			))}
		</div>
	);
}
