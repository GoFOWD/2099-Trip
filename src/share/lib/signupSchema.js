import { z } from 'zod';

export const signupSchema = z.object({
	email: z.string().email('올바른 이메일 형식이 아닙니다'),
	password: z
		.string()
		.min(8, '최소 8자 이상이어야 합니다')
		.regex(/[A-Z]/, '대문자를 포함해야 합니다')
		.regex(/[0-9]/, '숫자를 포함해야 합니다')
});
