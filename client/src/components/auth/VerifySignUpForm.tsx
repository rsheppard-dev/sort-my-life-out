'use client';

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
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { type VerifyEmail, verifyEmailSchema } from '@/schema/auth.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '../ui/input-otp';
import DisplayServerActionResult from '../DisplayServerActionResult';
import { useAction } from 'next-safe-action/hooks';
import { verifyEmailAction } from '@/actions/auth.actions';

export default function VerifySignUpForm() {
	const searchParams = useSearchParams();
	const email = searchParams.get('email') ?? '';

	const form = useForm<VerifyEmail>({
		resolver: zodResolver(verifyEmailSchema),
		defaultValues: {
			email,
			code: '',
		},
	});

	const { execute, result, isExecuting } = useAction(verifyEmailAction);

	function onSubmit(data: VerifyEmail) {
		execute(data);
	}

	return (
		<div className='mx-auto max-w-sm grid gap-4'>
			<DisplayServerActionResult result={result} title='Verification Failed' />
			<Card>
				<CardHeader>
					<CardTitle className='text-xl'>Verify Your Account</CardTitle>
					<CardDescription>
						Check your email for a verification code.
					</CardDescription>
				</CardHeader>
				<CardContent className='grid gap-2'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-2'>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<Input type='hidden' required {...field} />
								)}
							/>

							<FormItem className='grid gap-2'>
								<FormLabel>Email</FormLabel>
								<Input type='email' value={email} required disabled={true} />
								<FormMessage />
							</FormItem>

							<FormField
								control={form.control}
								name='code'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Code</FormLabel>
										<FormControl>
											<InputOTP
												autoFocus
												maxLength={6}
												{...field}
												disabled={isExecuting}
											>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
												</InputOTPGroup>
												<InputOTPSeparator />
												<InputOTPGroup>
													<InputOTPSlot index={2} />
													<InputOTPSlot index={3} />
												</InputOTPGroup>
												<InputOTPSeparator />
												<InputOTPGroup>
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type='submit' className='w-full' disabled={isExecuting}>
								Verify your account
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
