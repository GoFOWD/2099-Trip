import SelectCountry from './components/selectCountry';

export default async function planningPage({ searchParams }) {
	const country = (await searchParams).country;

	const results = await prisma.country.findMany({
		where: {
			OR: [
				{ name: { contains: country, mode: 'insensitive' } },
				{ nameKo: { contains: country, mode: 'insensitive' } }
			]
		}
	});

	console.log(results);
	return (
		<div className='h-screen'>
			<div className='px-4 h-[65px] bg-white flex items-center mb-4'>
				<span className='font-semibold text-lg'>일정 만들기</span>
			</div>
			<div className='px-4'>
				<div className='mb-4'>
					<SelectCountry results={results} />
				</div>
			</div>
		</div>
	);
}
