'use client';

export default function Modal({ children }) {
	return (
		<div className='fixed inset-0 px-8 bg-black/50 flex items-center justify-center z-50'>
			<div className='bg-white rounded-xl w-96 shadow-xl relative'>
				{children}
			</div>
		</div>
	);
}
