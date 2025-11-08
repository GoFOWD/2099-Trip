import prisma from '@/share/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOption } from '../api/auth/[...nextauth]/route';

import LogoutBtn from './components/LogoutBtn';

export default async function myPage() {
	const session = await getServerSession(authOption);

	const user = await prisma.user.findUnique({
		where: { email: session.user.email }
	});

	const createdAt = new Date(user.createdAt);
	const formatted = createdAt.toLocaleDateString('ko-KR', {
		year: 'numeric',
		month: 'long',
		day: '2-digit'
	});

	return (
		<div>
			<div className='bg-linear-to-r from-[#50B4BE] to-[#4AA3AD] h-[116px] px-4 py-6'>
				<div className='text-xl font-bold text-white py-1'>
					{user.name}
				</div>
				<div className='text-sm text-white py-1'>
					가입일 : {formatted}
				</div>
			</div>
			<div className='px-4'>
				<div className='px-4 py-6'>여행 기록 모음</div>
				<div className='pb-6'>여행 배지</div>
				<div className='pb-6'>최근 활동</div>
				<div className='pb-6'>
					<div className='font-semibold text-lg mb-4'>
						설정 및 도구
					</div>
					<LogoutBtn />
				</div>
			</div>
		</div>
	);
}
