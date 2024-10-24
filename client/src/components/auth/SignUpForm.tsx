'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { signUpSchema, type SignUp } from '@/schema/auth.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleOriginal } from 'devicons-react';
import { signUpAction } from '@/actions/auth.actions';
import { useAction } from 'next-safe-action/hooks';
import DisplayServerActionResult from '../DisplayServerActionResult';

export default function SignUpForm() {
	const form = useForm<SignUp>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			givenName: '',
			familyName: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const { execute, result, isExecuting } = useAction(signUpAction);

	function onSubmit(data: SignUp) {
		execute(data);
	}

	return (
		<div className='grid gap-4 mx-auto max-w-sm'>
			<DisplayServerActionResult result={result} title='Sign Up Failed' />
			<Card>
				<CardHeader>
					<CardTitle className='text-xl'>Sign Up</CardTitle>
					<CardDescription>
						Enter your information to create an account
					</CardDescription>
				</CardHeader>
				<CardContent className='grid gap-2'>
					<div className='grid gap-2'>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<div className='grid gap-4'>
									<div className='grid grid-cols-2 gap-4'>
										<FormField
											control={form.control}
											name='givenName'
											render={({ field }) => (
												<FormItem className='grid gap-2'>
													<FormLabel>First name</FormLabel>
													<Input required {...field} disabled={isExecuting} />
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name='familyName'
											render={({ field }) => (
												<FormItem className='grid gap-2'>
													<FormLabel>Last name</FormLabel>
													<Input required {...field} disabled={isExecuting} />
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<FormField
										control={form.control}
										name='email'
										render={({ field }) => (
											<FormItem className='grid gap-2'>
												<FormLabel>Email</FormLabel>
												<Input
													type='email'
													placeholder='me@example.com'
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
												<FormLabel>Password</FormLabel>
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

									<FormField
										control={form.control}
										name='confirmPassword'
										render={({ field }) => (
											<FormItem className='grid gap-2'>
												<FormLabel>Confirm Password</FormLabel>
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
										Create an account
									</Button>
								</div>
							</form>
						</Form>
						<Button
							variant='outline'
							className='flex gap-2'
							disabled={isExecuting}
						>
							<GoogleOriginal /> Sign up with Google
						</Button>
					</div>
					<div className='mt-4 text-center text-sm'>
						Already have an account?{' '}
						<Link href='/login' className='underline'>
							Login
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
