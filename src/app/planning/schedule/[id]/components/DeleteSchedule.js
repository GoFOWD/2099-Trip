'use client';

import { useState } from 'react';
import Modal from './Modal';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function DeleteSchedule() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const params = useParams();
	const { id } = params;
	const scheduleId = id;

	const deleteSchedule = async () => {
		setIsLoading(true);
		await fetch('/api/schedule', {
			method: 'delete',
			body: JSON.stringify({
				scheduleId
			})
		});
		router.push('/');
		setIsLoading(false);
	};

	return (
		<div>
			<button
				onClick={() => setIsOpen(true)}
				className='px-4 py-2 bg-[#508B91] text-white rounded-full cursor-pointer'>
				스케줄 삭제
			</button>

			{isOpen && (
				<Modal>
					{isLoading ? (
						<div className='h-30 px-4 py-3 flex items-center justify-center'>
							<span className='text-2xl font-semibold'>
								삭제 중입니다
							</span>
						</div>
					) : (
						<div>
							<h2 className='text-xl font-bold px-4 py-3 h-15 flex items-center justify-center'>
								스케줄을 삭제 하시겠습니까?
							</h2>
							<hr />
							<div className='px-4 flex justify-between'>
								<button
									onClick={deleteSchedule}
									className='h-15 flex-1 border-r border-r-black text-red-500 cursor-pointer'>
									네, 삭제할게요
								</button>
								<button
									className='h-15 flex-1 cursor-pointer'
									onClick={() => setIsOpen(false)}>
									아니요
								</button>
							</div>
						</div>
					)}
				</Modal>
			)}
		</div>
	);
}
