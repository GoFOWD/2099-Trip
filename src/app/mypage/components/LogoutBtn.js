'use client';

import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default function LogoutBtn() {
	return (
		<button
			className='w-full h-[74px] border border-[#F3F4F6] rounded-xl p-[17px] bg-white shadow-md flex cursor-pointer'
			onClick={() => signOut({ callbackUrl: '/onboarding' })}>
			<div className='rounded-full bg-[#F3F4F6] w-10 h-10 flex justify-center items-center'>
				<Image
					src='/logout.svg'
					width={15}
					height={15}
					alt='로그아웃 아이콘'
				/>
			</div>
			<span className='flex items-center pl-4'>로그아웃</span>
		</button>
	);
}
