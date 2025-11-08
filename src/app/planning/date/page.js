import prisma from '@/share/lib/prisma';
import DateUI from './components/dateUi';

export default async function Page({ searchParams }) {
	const countriesParams = (await searchParams).countries;
	const codes = Array.isArray(countriesParams)
		? countriesParams
		: [countriesParams];

	const countries = await prisma.country.findMany({
		where: { countryCode: { in: codes } },
		select: { countryCode: true, nameKo: true }
	});

	// 쿼리 순서(사용자 선택 순서)대로 정렬
	const ordered = codes
		.map(code => countries.find(c => c.countryCode === code))
		.filter(Boolean);

	return (
		<div className='px-4 h-screen'>
			<DateUI selectedCountries={ordered} />
		</div>
	);
}
