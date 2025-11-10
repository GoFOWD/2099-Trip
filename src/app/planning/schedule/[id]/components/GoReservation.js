import Link from 'next/link';

export default function GoReservation({ title, href }) {
	return (
		<div className='border border-[#E5E7EB] bg-white rounded-xl px-4 py-3 flex justify-between items-center h-15'>
			<p>{title} 예약 정보가 없습니다</p>
			<Link href={href} className='font-semibold text-(--brandColor)'>
				예약하러 가기
			</Link>
		</div>
	);
}
