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

		if (!file) {
			return NextResponse.json(
				{ error: '파일이 필요합니다' },
				{ status: 400 }
			);
		}

		// File 또는 Blob인지 확인
		if (!(file instanceof File) && !(file instanceof Blob)) {
			console.error('파일 타입 오류:', typeof file, file);
			return NextResponse.json(
				{ error: '유효하지 않은 파일 형식입니다' },
				{ status: 400 }
			);
		}

		// Supabase 클라이언트 생성
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		// 서비스 역할 키가 있으면 사용 (RLS 우회), 없으면 anon key 사용
		const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

		if (!supabaseUrl || !supabaseKey) {
			console.error('Supabase 환경 변수 확인:', {
				hasUrl: !!supabaseUrl,
				hasKey: !!supabaseKey,
				hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
				urlLength: supabaseUrl?.length || 0,
				keyLength: supabaseKey?.length || 0
			});
			return NextResponse.json(
				{ 
					error: 'Supabase 설정이 필요합니다',
					details: 'NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.'
				},
				{ status: 500 }
			);
		}

		// 서비스 역할 키를 사용하는 경우 RLS 우회 설정
		const supabase = createClient(supabaseUrl, supabaseKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		});

		// 파일명 생성 (타임스탬프 + 랜덤 문자열)
		const timestamp = Date.now();
		const randomStr = Math.random().toString(36).substring(2, 8);
		
		// 파일 확장자 추출 (붙여넣기 파일의 경우 처리)
		let fileExt = 'png'; // 기본값
		if (file.name && file.name.includes('.')) {
			fileExt = file.name.split('.').pop();
		} else if (file.type) {
			// MIME 타입에서 확장자 추출
			const mimeToExt = {
				'image/jpeg': 'jpg',
				'image/jpg': 'jpg',
				'image/png': 'png',
				'image/gif': 'gif',
				'image/webp': 'webp'
			};
			fileExt = mimeToExt[file.type] || 'png';
		}
		
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
				{ 
					error: '파일 업로드에 실패했습니다',
					details: error.message || '알 수 없는 오류',
					code: error.statusCode || error.code
				},
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
			{ 
				error: '서버 오류가 발생했습니다',
				details: error.message || '알 수 없는 오류'
			},
			{ status: 500 }
		);
	}
}

