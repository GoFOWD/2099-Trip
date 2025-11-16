'use client';

import dynamic from 'next/dynamic';
import NavWraper from './NavWraper';

const FooterNav = () => {
	const NavWraper = dynamic(() => import('./NavWraper'), { ssr: false });

	return <NavWraper />;
};
export default FooterNav;
