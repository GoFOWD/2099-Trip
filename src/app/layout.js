import './globals.css';
import Providers from '../share/lib/providers';
import FooterNav from '@/share/ui/FooterNav';
import { pretendard } from '@/share/ui/fonts';

export const metadata = {
	title: '2099-Trip',
	description: 'Travel helper'
};

export default function RootLayout({ children }) {
	return (
		<html lang='ko'>
			<head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0, maximum-scale=1.0'
				/>
			</head>
			<body
				className={`max-w-[700px] mx-auto  bg-[#ffffff] ${pretendard.className} antialiased`}>
				<Providers>
					<main className='bg-[#f3f4f6]'>{children}</main>
					<footer>
						<FooterNav />
					</footer>
				</Providers>
			</body>
		</html>
	);
}
