import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOption } from './api/auth/[...nextauth]/route';

import HomePage from './home/page';

export default async function Home() {
	const session = await getServerSession(authOption);

	if (!session) {
		redirect('/onboarding');
	}

	return <HomePage />;
}
