import { getServerSession } from 'next-auth';
import Onboarding from './onboarding/page';
import HomePage from './home/page';

export default async function Home() {
	const session = await getServerSession();

	if (!session) {
		return <Onboarding />;
	}

	return <HomePage />;
}
