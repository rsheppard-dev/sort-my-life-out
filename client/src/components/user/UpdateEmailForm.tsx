'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { UpdateEmail, updateEmailSchema } from '@/schema/user.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

type Props = {
	user: UserSession;
};

export default function UpdateEmailForm({ user }: Props) {
	const form = useForm<UpdateEmail>({
		resolver: zodResolver(updateEmailSchema),
		defaultValues: {
			email: '',
		},
	});

	const { isSubmitting } = form.formState;

	async function onSubmit(values: UpdateEmail) {
		console.log(values);
	}
	return (
		<Card>
			<CardHeader>
				<CardTitle>Email</CardTitle>
				<CardDescription>
					Change your email here. You will be required to verify your new email
					address.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-2'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
						<div className='grid gap-2'>
							<FormLabel>Current Email</FormLabel>
							<Input disabled={true} value={user.email} />
						</div>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem className='grid gap-2'>
									<FormLabel>New Email</FormLabel>
									<Input required {...field} disabled={isSubmitting} />
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
			<CardFooter>
				<Button disabled={isSubmitting}>Update email</Button>
			</CardFooter>
		</Card>
	);
}
