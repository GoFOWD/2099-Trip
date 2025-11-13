import { NextResponse } from 'next/server';
import { getPhotosUrl } from '@/share/util/getPhotosUrl';

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const place = searchParams.get('place');

	if (!place) {
		return NextResponse.json(
			{ error: 'place 파라미터 필요' },
			{ status: 400 }
		);
	}

	try {
		const url = await getPhotosUrl(place);
		return NextResponse.json({ url });
	} catch (err) {
		return NextResponse.json({ error: err.message }, { status: 500 });
	}
}
