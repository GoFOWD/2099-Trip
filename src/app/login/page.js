'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import LoadingSpin from '@/share/ui/LoadinSpin';
import Link from 'next/link';

export default function loginPage() {
	const [emailInput, setEmailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [loginError, setLoginError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [loginLoading, setLoginLoading] = useState(false);

	const router = useRouter();

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			if (!emailInput || !passwordInput) {
				setLoginError('이메일과 비밀번호를 입력해주세요');
				return;
			}
			setIsLoading(true);
			setLoginLoading(true);

			const result = await signIn('credentials', {
				email: emailInput,
				password: passwordInput,
				redirect: false
			});

			setIsLoading(false);

			if (!result.ok) {
				setLoginError('이메일 또는 비밀번호가 일치하지 않습니다');
				return;
			}

			router.push('/');
		} catch (error) {
			setLoginLoading(false);
			setLoginError('오류가 발생했습니다 잠시 후 다시 시도해 주세요');
		}
	};

	if (loginLoading) {
		return (
			<div className='h-screen flex items-center justify-center bg-white'>
				<h1 className='text-2xl font-bold tracking-in-contract-bck text-(--brandColor)'>
					즐거운 여행의 시작
				</h1>
			</div>
		);
	}
	return (
		<div className='h-screen'>
			<div className='w-full h-[92px] bg-white flex justify-center items-center relative mb-8'>
				<div className='absolute left-8 flex items-center'>
					<Image
						src='/login/left_arrow.svg'
						width={15}
						height={13}
						alt='이전버튼'
					/>
				</div>
				<div className='font-semibold text-lg flex items-center'>
					로그인
				</div>
			</div>
			<div className='px-4 flex items-center'>
				<form
					className='flex-1 mb-4 p-[17px] border rounded-xl border-[#F3F4F6] drop-shadow bg-white'
					onSubmit={handleSubmit}
					noValidate>
					<div className='mb-4 flex flex-col'>
						<label htmlFor='email' className='mb-2 text-sm'>
							이메일
						</label>
						<input
							type='email'
							id='email'
							name='email'
							value={emailInput}
							placeholder='이메일을 입력하세요'
							onChange={e => setEmailInput(e.target.value)}
							className='text-sm not-odd:h-[46px] px-[17px] py-[13px] border border-[#D1D5DB] rounded-xl focus:outline-2 focus:outline-(--brandColor)'
						/>
					</div>

					<div className='mb-4 flex flex-col'>
						<label htmlFor='password' className='mb-2 text-sm'>
							비밀번호
						</label>
						<input
							type='password'
							id='password'
							name='passwrod'
							value={passwordInput}
							placeholder='비밀번호를 입력하세요'
							onChange={e => setPasswordInput(e.target.value)}
							className='text-sm h-[46px] px-[17px] py-[13px] border border-[#D1D5DB] rounded-xl focus:outline-2 focus:outline-(--brandColor)'
						/>
					</div>

					<div>
						{loginError ? (
							<p className='text-sm text-red-500 mb-2'>
								{loginError}
							</p>
						) : null}
						<button
							type='submit'
							className='px-4 py-3 w-full h-12 flex justify-center items-center bg-(--brandColor) rounded-xl text-white cursor-pointer'>
							{isLoading ? <LoadingSpin size={40} /> : '로그인'}
						</button>
						<p className='text-sm flex justify-center mt-4'>
							아직 계정이 없으신가요?{' '}
							<Link
								href='/signup'
								className='ml-2 text-(--brandColor)'>
								회원가입
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}
