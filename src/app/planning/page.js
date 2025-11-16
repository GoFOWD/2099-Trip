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

	return (
		<div className='h-screen pb-[65px]'>
			<div className='px-4 h-[65px] bg-white flex items-center mb-4'>
				<span className='font-semibold text-lg'>일정 만들기</span>
			</div>
			<div className='px-4'>
				<div className='mb-4'>
					<h1 className='font-bold text-xl mb-2'>
						이번 여행은 어디로 가시나요
					</h1>
					<p className='text-[#4B5563] text-sm'>
						하나의 국가 또는 여러개의 국가를 선택 해 주세요
					</p>
				</div>
				<div className='mb-4'>
					<SelectCountry results={results} />
				</div>
			</div>
		</div>
	);
}
