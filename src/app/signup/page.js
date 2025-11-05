'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { signupSchema } from '@/share/lib/signupSchema';
import { v4 as uuid } from 'uuid';

export default function signupPage() {
	const [emailInput, setEmailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [passwordCheck, setPasswordCheck] = useState('');
	const [nameInput, setNameInput] = useState('');
	const [btnDisable, setBtnDisable] = useState(true);
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState([]);
	const [passwordCheckError, setPasswrodCheckError] = useState('');
	const [fetchError, setFetchError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const emailSchema = signupSchema.pick({ email: true });
	const passwordSchema = signupSchema.pick({ password: true });

	const router = useRouter();

	useEffect(() => {
		if (emailInput.length === 0) {
			setEmailError('');
		}
		if (passwordInput.length === 0) {
			setPasswordError([]);
		}
		const emailValidate = emailSchema.safeParse({ email: emailInput });
		const passwordValidate = passwordSchema.safeParse({
			password: passwordInput
		});

		if (emailInput.length !== 0) {
			if (!emailValidate.success) {
				const issue = emailValidate.error.issues[0].message;
				setEmailError(issue);
			} else {
				setEmailError('');
			}
		}

		if (passwordInput.length !== 0) {
			if (!passwordValidate.success) {
				const issues = passwordValidate.error.issues;
				const messages = issues.map(issue => {
					return {
						id: uuid(),
						message: issue.message
					};
				});
				setPasswordError(messages);
			} else {
				setPasswordError([]);
			}
		}

		const isPasswordSame = passwordInput === passwordCheck;

		if (passwordCheck.length !== 0 && !isPasswordSame) {
			setPasswrodCheckError('비밀번호가 일치 하지 않습니다');
		} else {
			setPasswrodCheckError('');
		}

		if (
			emailValidate.success &&
			passwordValidate.success &&
			isPasswordSame
		) {
			setBtnDisable(false);
		} else {
			setBtnDisable(true);
		}
	}, [emailInput, passwordInput, passwordCheck]);

	const handleSubmit = async e => {
		console.log('회원가입 버튼 클릭');
		e.preventDefault();
		setIsLoading(true);

		try {
			const result = await fetch('/api/auth/signup', {
				method: 'post',
				body: JSON.stringify({
					email: emailInput,
					password: passwordInput,
					name: nameInput
				})
			});
			console.log('회원가입 post 요청 완료');

			if (!result.ok) {
				setFetchError(result.error);
				return;
			}

			setFetchError('');
			setIsLoading(false);
			router.push('/login');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
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
					회원가입
				</div>
			</div>
			<div className='px-4'>
				<div className='mb-8 flex justify-center'>
					<Image
						src='/login/login_mainImage.svg'
						width={343}
						height={157}
						alt='로그인 환영 이미지'
						priority
					/>
				</div>
				<form
					className='mb-4 p-[17px] border-1 rounded-[12px] border-[#F3F4F6] drop-shadow bg-white'
					onSubmit={handleSubmit}>
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
							className='text-sm not-odd:h-[46px] px-[17px] py-[13px] border border-[#D1D5DB] rounded-[12px] focus:outline-2 focus:outline-[var(--brandColor)]'
						/>
						{emailError ? (
							<p className='text-sm text-red-500 mt-2'>
								{emailError}
							</p>
						) : null}
					</div>
					<div className='mb-4 flex flex-col'>
						<label htmlFor='name' className='mb-2 text-sm'>
							이름
						</label>
						<input
							type='text'
							id='name'
							name='name'
							value={nameInput}
							placeholder='이름을 입력하세요'
							onChange={e => setNameInput(e.target.value)}
							className='text-sm h-[46px] px-[17px] py-[13px] border border-[#D1D5DB] rounded-[12px] focus:outline-2 focus:outline-[var(--brandColor)]'
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
							className='text-sm h-[46px] px-[17px] py-[13px] border border-[#D1D5DB] rounded-[12px] focus:outline-2 focus:outline-[var(--brandColor)]'
						/>
						{passwordError
							? passwordError.map(error => (
									<p
										key={error.id}
										className='text-sm text-red-500 mt-2'>
										{error.message}
									</p>
							  ))
							: null}
					</div>
					<div className='mb-4 flex flex-col'>
						<label htmlFor='passwordCheck' className='mb-2 text-sm'>
							비밀번호 확인
						</label>
						<input
							type='password'
							id='passwordCheck'
							name='passwordCheck'
							value={passwordCheck}
							placeholder='비밀번호를 한번 더 입력하세요'
							onChange={e => setPasswordCheck(e.target.value)}
							className='text-sm h-[46px] px-[17px] py-[13px] border border-[#D1D5DB] rounded-[12px] focus:outline-2 focus:outline-[var(--brandColor)]'
						/>
						{passwordCheckError ? (
							<p className='text-sm text-red-500 mt-2'>
								{passwordCheckError}
							</p>
						) : null}
					</div>
					<div>
						<button
							type='submit'
							disabled={btnDisable}
							className={clsx({
								'px-4 py-3 w-full h-[48px] text-center bg-[var(--brandColor)] rounded-[12px] text-white cursor-pointer':
									btnDisable === false,
								'px-4 py-3 w-full h-[48px] text-center bg-[var(--brandColor)] rounded-[12px] text-gray-300 opacity-50':
									btnDisable === true
							})}>
							회원가입
						</button>
						{fetchError ? (
							<p className='text-sm text-red-500 mt-2'>
								{fetchError}
							</p>
						) : null}
						<p className='text-sm flex justify-center mt-4'>
							이미 계정이 있으신가요?{' '}
							<Link
								href='/login'
								className='ml-2 text-[var(--brandColor)]'>
								로그인
							</Link>
						</p>
					</div>
				</form>
				<div>
					<div className='h-5 relative flex items-center justify-center'>
						<p className='absolute text-[#6B7280] z-30 px-2 h-full flex items-center bg-[#F3F4F6]'>
							또는
						</p>
						<hr className='border-[#6B7280] w-full' />
					</div>
					<div>
						<div>구글</div>
						<div>네이버</div>
						<div>카카오</div>
					</div>
				</div>
			</div>
		</div>
	);
}
