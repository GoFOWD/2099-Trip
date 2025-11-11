import Image from 'next/image';

export const metadata = {
	title: '2099-Trip',
	description: 'Travel helper',
	name: 'viewport',
	content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0'
};

export default function RootLayout({ children }) {
	return (
		<div>
			<header>
				<div className='bg-white h-[65px] flex justify-between px-4 py-3'>
					<p className='font-semibold text-lg flex items-center'>
						마이페이지
					</p>
					<Image
						src='/setting.svg'
						width={15}
						height={15}
						alt='세팅 아이콘'
					/>
				</div>
			</header>
			<main className='pb-[65px]'>{children}</main>
		</div>
	);
}
