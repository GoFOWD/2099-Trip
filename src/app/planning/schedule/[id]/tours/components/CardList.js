'use client';

import { useState } from 'react';
import DetailModal from './DetailModal';
import ItemCard from './ItemCard';

export default function CardList({ sortedDetails }) {
	const [selected, setSelected] = useState(null);

	return (
		<>
			<div className='flex flex-col gap-4'>
				{sortedDetails.map(detail => {
					return (
						<ItemCard
							key={detail.placeId}
							item={detail}
							onClick={() => setSelected(detail)}
						/>
					);
				})}
			</div>

			{selected && (
				<DetailModal
					item={selected}
					onClose={() => setSelected(null)}
				/>
			)}
		</>
	);
}
