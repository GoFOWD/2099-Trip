import Link from 'next/link';
import Image from 'next/image';

export default function MakeSchedule() {
	return (
		<Link
			href='/planning'
			className='w-full h-[150px] bg-linear-to-r from-[#50B4BE] to-[#4AAD94] flex flex-col justify-center items-center rounded-xl'>
			<Image
				src='/homeIcon/makeSchedule.svg'
				width={70}
				height={70}
				alt='스케줄 만들기'
				className='mb-3'
			/>
			<p className='font-semibold text-lg text-white'>새 일정 만들기</p>
		</Link>
	);
}
