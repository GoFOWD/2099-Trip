import './globals.css';
import Providers from '../share/lib/providers';
import FooterVisiable from '@/share/ui/FooterVisiable';

export const metadata = {
	title: '2099-Trip',
	description: 'Travel helper'
};

export default function RootLayout({ children }) {
	return (
		<html lang='ko'>
			<body className='min-w-[375px] max-w-[700px] mx-auto  bg-[#F3F4F6]'>
				<Providers>
					<main>{children}</main>
					<footer>
						<FooterVisiable />
					</footer>
				</Providers>
			</body>
		</html>
	);
}
