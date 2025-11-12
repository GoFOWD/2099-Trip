import { NextResponse } from 'next/server';

export async function GET(req) {
	const API_kEY = process.env.KR_OPEN_API_KEY;

	const { searchParams } = req.nextUrl;
	const country = searchParams.get('country');

	try {
		const res = await fetch(
			`http://apis.data.go.kr/1262000/CountryFlagService2/getCountryFlagList2?ServiceKey=${API_kEY}&returnType=JSON&numOfRows=1&cond[country_nm::EQ]=${country}&pageNo=1`
		);

		const data = await res.json();

		if (!data.response.body.items.item[0].download_url) {
			return NextResponse.json(
				{ error: '국기정보가 없습니다' },
				{ status: data.resultCode }
			);
		}

		const url = data.response.body.items.item[0].download_url;

		return NextResponse.json(
			{ url, success: data.resultMsg },
			{ status: data.resultCode }
		);
	} catch (error) {
		console.error(error);
		return NextResponse({ error }, { status: 500 });
	}
}
