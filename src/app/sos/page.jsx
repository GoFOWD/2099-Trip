'use client';
import SOSPack from './SOSPack';

export default function Page() {
	return (
		<div className='sospack pb-[65px]'>
			<SOSPack
				onClose={() => {
					/* TODO: 필요하면 라우팅 처리 */
				}}
			/>
		</div>
	);
}
