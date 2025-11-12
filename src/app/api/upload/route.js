import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '../auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
	try {
		const session = await getServerSession(authOption);

		if (!session || !session.user || !session.user.email) {
			return NextResponse.json(
				{ error: '인증이 필요합니다' },
				{ status: 401 }
			);
		}

		const formData = await req.formData();
		const file = formData.get('file');

		if (!file || !(file instanceof File)) {
			return NextResponse.json(
				{ error: '파일이 필요합니다' },
				{ status: 400 }
			);
		}

		// Supabase 클라이언트 생성
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

		if (!supabaseUrl || !supabaseAnonKey) {
			return NextResponse.json(
				{ error: 'Supabase 설정이 필요합니다' },
				{ status: 500 }
			);
		}

		const supabase = createClient(supabaseUrl, supabaseAnonKey);

		// 파일명 생성 (타임스탬프 + 랜덤 문자열)
		const timestamp = Date.now();
		const randomStr = Math.random().toString(36).substring(2, 8);
		const fileExt = file.name.split('.').pop();
		const fileName = `${session.user.email}/${timestamp}-${randomStr}.${fileExt}`;

		// 파일을 ArrayBuffer로 변환
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Supabase Storage에 업로드
		const { data, error } = await supabase.storage
			.from('diary-photos')
			.upload(fileName, buffer, {
				contentType: file.type,
				upsert: false
			});

		if (error) {
			console.error('Supabase 업로드 오류:', error);
			return NextResponse.json(
				{ error: '파일 업로드에 실패했습니다' },
				{ status: 500 }
			);
		}

		// 공개 URL 가져오기
		const { data: urlData } = supabase.storage
			.from('diary-photos')
			.getPublicUrl(fileName);

		return NextResponse.json({
			success: true,
			url: urlData.publicUrl,
			fileName: fileName
		});
	} catch (error) {
		console.error('파일 업로드 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}

