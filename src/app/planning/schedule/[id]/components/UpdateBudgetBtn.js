'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function UdateBudgetBtn() {
	const router = useRouter();
	const params = useParams();
	const { id } = params;
	const scheduleId = id;

	return (
		<button
			onClick={() =>
				router.push(`/planning/schedule/${scheduleId}/budget`)
			}
			className='text-[#F97316] font-semibold cursor-pointer'>
			예산 수정하기
		</button>
	);
}
