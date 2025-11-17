import Image from 'next/image';
import Link from 'next/link';

export default function CheckTour({ tours, id }) {
	return (
		<div className='p-[17px] flex justify-between items-center border-2 border-green-600 rounded-lg bg-white'>
			<div className='flex items-center gap-2.5'>
				<div className='w-10 h-10 relative'>
					<Image
						src='/check.svg'
						fill
						sizes='40px'
						className='object-contain'
						alt='체크'
					/>
				</div>
				<div className='flex flex-col gap-2'>
					<p className='text-sm'>관광지 동선 체크</p>
					<Link
						href={`/planning/schedule/${id}/tours`}
						className='text-sm text-gray-500'>
						다시 확인하기
					</Link>
				</div>
			</div>
			<p className='text-sm text-green-600'>완료</p>
		</div>
	);
}
