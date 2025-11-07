import Link from 'next/link';
import Image from 'next/image';

export default function QuickIcon({ href, src, alt, children }) {
	return (
		<Link
			href={href}
			className='flex flex-col w-[65px] h-[65px] justify-center items-center bg-white p-2 border border-[#F3F4F6] rounded-xl shadow-sm'>
			<Image src={src} alt={alt} width={35} height={35} />
			<p className='text-sm'>{children}</p>
		</Link>
	);
}
