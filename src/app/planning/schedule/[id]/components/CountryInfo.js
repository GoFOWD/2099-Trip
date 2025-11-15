import Link from 'next/link';

export default function CountryInfo({ visitCountry }) {
	return (
		<Link
			href={`/traveling/warning`}
			className='w-full h-[55px] bg-white border-2 border-(--brandColor) rounded-xl px-4 py-3 flex justify-center items-center text-(--brandColor) font-semibold'>
			나라 정보
		</Link>
	);
}
