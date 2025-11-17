'use client';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function PaymentButton({ enabled }) {
	const router = useRouter();
	const id = useParams();

	const handleClick = () => {
		if (!enabled) return;

		router.push(`/planning/schedule/${id}`);
	};

	return (
		<div className='left-0 right-0 bg-white border-t p-3'>
			<button
				onClick={handleClick}
				disabled={!enabled}
				className={`btn_broad w-full ${
					!enabled ? 'opacity-50 cursor-not-allowed' : ''
				}`}>
				결제 진행하기
			</button>
		</div>
	);
}
