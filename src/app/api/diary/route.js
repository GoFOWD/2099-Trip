import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '../auth/[...nextauth]/route';
import prisma from '@/share/lib/prisma';

// 다이어리 생성
export async function POST(req) {
	try {
		const session = await getServerSession(authOption);

		if (!session || !session.user || !session.user.email) {
			return NextResponse.json(
				{ error: '인증이 필요합니다' },
				{ status: 401 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email }
		});

		if (!user) {
			return NextResponse.json(
				{ error: '사용자를 찾을 수 없습니다' },
				{ status: 404 }
			);
		}

		const body = await req.json();
		const { title, content, date } = body;

		if (!title || !date) {
			return NextResponse.json(
				{ error: '제목, 날짜는 필수입니다' },
				{ status: 400 }
			);
		}

		// 다이어리 생성
		const diary = await prisma.diary.create({
			data: {
				title,
				content: content || '',
				date,
				authorId: user.id
			}
		});

		return NextResponse.json({
			success: true,
			diary: {
				id: diary.id,
				title: diary.title,
				content: diary.content,
				date: diary.date
			}
		});
	} catch (error) {
		console.error('다이어리 생성 오류:', error);
		return NextResponse.json(
			{ error: '서버 오류가 발생했습니다' },
			{ status: 500 }
		);
	}
}

