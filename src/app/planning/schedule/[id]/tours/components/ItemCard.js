import Image from 'next/image';
import { keywordMap } from '../lib/keywordMap';

export default function ItemCard({ item, onClick }) {
	const keywords = item.keword;

	const keywordKo = keywords.map(keyword => {
		const keywordKo = keywordMap[keyword];
		return keywordKo;
	});

	const deletUndefined = keywordKo.filter(k => k !== undefined);

	const formattedKeword = deletUndefined.map(k => `#${k}`);

	return (
		<div className='cursor-pointer border border-[#F3F4F6] rounded-lg shadow-md'>
			<div className='w-full h-48 relative'>
				<Image
					src={item.photoUrl[0]}
					fill
					sizes='100%'
					alt={`${item.placeName}`}
					className='object-cover rounded-t-lg'
				/>
			</div>
			<div className='flex flex-col gap-2 pt-3'>
				<div className='px-4'>
					<div className='flex gap-1'>
						<h3 className='font-semibold mb-4'>{item.placeName}</h3>
						<div className='flex gap-0.5 items-center mb-4'>
							<div className='w-3 h-3 relative flex items-center'>
								<Image
									src='/star.svg'
									fill
									sizes='12px'
									alt='평점'
									className='object-contain'
								/>
							</div>
							<span className='text-[#374151] text-sm'>
								{item.rating} {`(${item.reviewCount})`}
							</span>
						</div>
					</div>
					<p className='text-sm text-[#4B5563] mb-4'>
						{item.description}
					</p>
					<div className='flex gap-1 mb-2'>
						{formattedKeword.map((k, i) => (
							<p
								key={i}
								className='px-2 py-1 rounded-full bg-[#E2E1E1] text-[12px] text-[#4B5563]'>
								{k}
							</p>
						))}
					</div>
				</div>
				<div className='flex rounded-b-lg h-10 border-t border-t-[#E2E1E1]'>
					<button className='flex-1 rounded-bl-lg' onClick={onClick}>
						상세 보기
					</button>
					<button className='flex-1 bg-(--brandColor) text-white rounded-br-lg'>
						일정 등록
					</button>
				</div>
			</div>
		</div>
	);
}
