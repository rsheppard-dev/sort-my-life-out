'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { Login, loginSchema } from '@/schema/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleOriginal } from 'devicons-react';
import { useAction } from 'next-safe-action/hooks';
import { loginAction } from '@/actions/auth.actions';
import DisplayServerActionResult from '../DisplayServerActionResult';

export default function LoginForm() {
	const form = useForm<Login>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const { isExecuting, execute, result } = useAction(loginAction);

	async function onSubmit(values: Login) {
		execute(values);
	}

	return (
		<div className='w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]'>
			<div className='flex items-center justify-center py-12'>
				<div className='mx-auto grid w-[350px] gap-6'>
					<div className='grid gap-2 text-center'>
						<h1 className='text-3xl font-bold'>Login</h1>
						<DisplayServerActionResult result={result} title={'Login Failed'} />
						<p className='text-balance text-muted-foreground'>
							Enter your email below to login to your account
						</p>
					</div>
					<div>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
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
													disabled={isExecuting}
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
													disabled={isExecuting}
												/>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button
										type='submit'
										className='w-full'
										disabled={isExecuting}
									>
										Login
									</Button>
								</div>
							</form>
						</Form>
					</div>
					<Button
						variant='outline'
						className='flex gap-2'
						disabled={isExecuting}
					>
						<GoogleOriginal /> Login with Google
					</Button>
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
