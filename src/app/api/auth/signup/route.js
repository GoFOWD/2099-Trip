import { NextResponse } from 'next/server';
import { hashPassword } from '@/share/lib/bcrypt';
import prisma from '@/share/lib/prisma';
import { signupSchema } from '@/share/lib/signupSchema';
import { z } from 'zod';

export async function POST(req) {
	try {
		const body = await req.json();

		// 입력값 검증
		const parsed = signupSchema.parse(body);

		// 사용중인 이메일인지 확인
		const existUser = await prisma.user.findUnique({
			where: { email: parsed.email }
		});

		if (existUser) {
			return NextResponse.json(
				{ error: '사용중인 이메일입니다' },
				{ status: 400 }
			);
		}

		// 비밀번호 암호화
		const hashedPassword = await hashPassword(parsed.password);

		const newUser = await prisma.user.create({
			data: {
				email: parsed.email,
				password: hashedPassword,
				name: body.name
			}
		});

		const { password: _, ...userDate } = newUser;

		return NextResponse.json(userDate, { status: 201 });
	} catch (error) {
		console.error(error);
		// 입력값 검증 실패시
		if (error instanceof z.ZodError) {
			console.log('입력값 검증 실패');
			return NextResponse.json(
				{ errors: '이메일과 비밀번호를 올바르게 입려해주세요' },
				{ status: 400 }
			);
		}
		// 서버 오류
		console.log('데이터베이스 연동 오류');
		return NextResponse.json(
			{ error: '오류가 발생했습니다 잠시 후 다시 시도해 주세요' },
			{ status: 500 }
		);
	}
}
