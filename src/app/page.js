import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import HomePage from './home/page';

export default async function Home() {
	const session = await getServerSession();

	if (!session) {
		redirect('/onboarding');
	}

	return <HomePage />;
}
