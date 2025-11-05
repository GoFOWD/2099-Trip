'use client';

import { usePathname } from 'next/navigation';
import FooterNav from './FooterNav';

export default function FooterVisiable() {
	const pathname = usePathname();
	const hideFooter = ['/login', '/signup'].includes(pathname);

	if (hideFooter) return null;
	return <FooterNav />;
}
