'use client';

import { usePathname } from 'next/navigation';
import FooterNav from './FooterNav';

export default function FooterVisiable() {
	const pathname = usePathname();
	const hideFooter = ['/login', '/signup', '/onboarding'].includes(pathname);

	if (hideFooter) return null;
	return <FooterNav />;
}
