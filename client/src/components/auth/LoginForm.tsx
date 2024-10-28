'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { Login, loginSchema } from '@/schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useRef } from 'react';
import { login } from '@/actions/auth.actions';
import DisplayServerActionResult from '../DisplayServerActionResult';
import LoginWithGoogle from './LoginWithGoogle';

export default function LoginForm() {
	const [state, loginAction] = useActionState(login, undefined);
	const formRef = useRef<HTMLFormElement>(null);

	const form = useForm<Login>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const { isSubmitting } = form.formState;

	return (
		<div className='w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]'>
			<div className='flex items-center justify-center py-12'>
				<div className='mx-auto grid w-[350px] gap-6'>
					<div className='grid gap-2 text-center'>
						<h1 className='text-3xl font-bold'>Login</h1>
						<DisplayServerActionResult
							result={state}
							title={'Login Unsuccessful'}
						/>
						<p className='text-balance text-muted-foreground'>
							Enter your email below to login to your account
						</p>
					</div>
					<div>
						<Form {...form}>
							<form
								action={loginAction}
								ref={formRef}
								onSubmit={() => formRef.current?.requestSubmit()}
							>
								<div className='grid gap-4'>
									<FormField
										control={form.control}
										name='email'
										render={({ field }) => (
											<FormItem className='grid gap-2'>
												<FormLabel>Email</FormLabel>
												<Input
													type='email'
													required
													{...field}
													disabled={isSubmitting}
												/>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='password'
										render={({ field }) => (
											<FormItem className='grid gap-2'>
												<div className='flex items-center'>
													<FormLabel htmlFor='password'>Password</FormLabel>
													<Link
														href='/forgot-password'
														className='ml-auto inline-block text-sm underline'
													>
														Forgot your password?
													</Link>
												</div>
												<Input
													type='password'
													required
													{...field}
													disabled={isSubmitting}
												/>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button
										type='submit'
										className='w-full'
										disabled={isSubmitting}
									>
										Login
									</Button>
								</div>
							</form>
						</Form>
					</div>
					<LoginWithGoogle isSubmitting={isSubmitting} />
					<div className='mt-4 text-center text-sm'>
						Don&apos;t have an account?{' '}
						<Link href='/signup' className='underline'>
							Sign up
						</Link>
					</div>
				</div>
			</div>
			<div className='hidden bg-muted lg:block'>
				<Image
					src='/placeholder.svg'
					alt='Image'
					width='1920'
					height='1080'
					className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
				/>
			</div>
		</div>
	);
}
