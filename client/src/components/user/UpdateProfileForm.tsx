'use client';

import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import {
	Card,
	CardDescription,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { UpdateProfile, updateProfileSchema } from '@/schema/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { updateProfileAction } from '@/actions/user.actions';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/getErrorMessage';

const user = {
	userAttributes: {
		email: 'rsheppard83@gmail.com',
		given_name: 'Roy',
		family_name: 'Sheppard',
		birthdate: '1983-06-30',
		picture: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
	},
};

export default function UpdateProfileForm() {
	const form = useForm<UpdateProfile>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			givenName: user?.userAttributes.given_name ?? '',
			familyName: user?.userAttributes.family_name ?? '',
			dateOfBirth: user?.userAttributes?.birthdate
				? new Date(user.userAttributes.birthdate)
				: undefined,
		},
	});

	const { isSubmitting } = form.formState;

	const { execute } = useAction(updateProfileAction, {
		onSuccess: () => {
			toast({
				title: 'Profile updated successfully.',
				description: 'Your profile has been updated.',
			});
		},
		onError: error => {
			toast({
				title: 'Failed to update profile.',
				description: getErrorMessage(error),
				variant: 'destructive',
			});
		},
	});

	const onSubmit = (values: UpdateProfile) => {
		try {
			execute(values);
		} catch (error) {
			console.error('Failed to submit form:', error);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>
					Make changes to your account here. Click save when you&apos;re done.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-2'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
						<FormField
							control={form.control}
							name='givenName'
							render={({ field }) => (
								<FormItem className='grid gap-2'>
									<FormLabel>First name</FormLabel>
									<Input
										required
										{...field}
										disabled={isSubmitting}
										defaultValue={user?.userAttributes.given_name}
									/>
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
									<Input
										required
										{...field}
										disabled={isSubmitting}
										defaultValue={user?.userAttributes.family_name}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='dateOfBirth'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel>Date of birth</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={'outline'}
													disabled={isSubmitting}
													className={cn(
														'pl-3 text-left font-normal',
														!field.value && 'text-muted-foreground'
													)}
												>
													{field.value ? (
														format(field.value, 'PPP')
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className='w-auto p-0' align='start'>
											<Calendar
												mode='single'
												selected={field.value}
												onSelect={field.onChange}
												disabled={date =>
													date > new Date() || date < new Date('1900-01-01')
												}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
			<CardFooter>
				<Button>Save changes</Button>
			</CardFooter>
		</Card>
	);
}
