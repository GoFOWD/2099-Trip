'use client';

export default function BaseModal({ title, onClose, children }) {
	return (
		<div
			className='
        fixed inset-0 z-50 
        flex items-center justify-center 
        bg-black/40 backdrop-blur-sm
      '>
			{/* 오버레이 클릭 시 닫기 */}
			<div className='absolute inset-0' onClick={onClose} />

			{/* 모달 박스 */}
			<div
				className='
          relative z-10 
          bg-white 
          w-[90%] max-w-lg 
          rounded-lg 
          shadow-lg 
          flex flex-col 
          max-h-[90vh]
        '>
				{/* 상단 헤더: 제목 + 닫기버튼 (고정) */}
				<div
					className='
            flex justify-between items-center 
            px-4 py-3 border-b 
            bg-white sticky top-0 
            z-20
          '>
					<h2 className='text-lg font-semibold text-(--brandColor) truncate'>
						{title}
					</h2>
					<button
						onClick={onClose}
						className='text-slate-400 hover:text-slate-700 text-xl'>
						×
					</button>
				</div>

				{/* 내용 스크롤 영역 */}
				<div className='flex-1 overflow-y-auto p-4'>{children}</div>
			</div>
		</div>
	);
}
