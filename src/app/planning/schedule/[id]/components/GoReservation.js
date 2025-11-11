import Link from 'next/link';
import Image from 'next/image';

export default function GoReservation({ title, href, src }) {
	return (
		<div className='border border-[#E5E7EB] bg-white rounded-xl px-4 py-3 flex justify-between items-center h-15'>
			<div className='flex gap-3 items-center'>
				<Image src={src} width={40} height={40} alt='아이콘' />
				<p className='text-sm'>{title} 예약 정보가 없습니다</p>
			</div>
			<Link href={href} className='font-semibold text-(--brandColor)'>
				예약하러 가기
			</Link>
		</div>
	);
}
