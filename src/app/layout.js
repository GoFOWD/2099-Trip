import './globals.css';
import Providers from './providers';
import FooterNav from '@/share/ui/FooterNav';

export const metadata = {
	title: '2099-Trip',
	description: 'Travel helper'
};

export default function RootLayout({ children }) {
	return (
		<html lang='ko'>
			<body className='min-w-[375px] max-w-[700px] mx-auto  bg-[#ffffff]'>
				<Providers>
					<main>{children}</main>
					<footer>
						<FooterNav />
					</footer>
				</Providers>
			</body>
		</html>
	);
}
