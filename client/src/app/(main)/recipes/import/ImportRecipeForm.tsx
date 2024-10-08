'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { importRecipeAction } from '@/actions/recipe.actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	ImportRecipeRequest,
	importRecipeSchema,
} from '@/schema/recipe.schema';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function ImportRecipeForm() {
	const router = useRouter();
	const { toast } = useToast();
	const { executeAsync, isExecuting } = useAction(importRecipeAction, {
		onSuccess: ({ data }) => {
			toast({
				variant: 'default',
				title: 'Success 🎉',
				description: data?.success,
			});

			console.log(data?.recipe);
		},
		onError: ({ error }) => {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Failed to import the recipe.',
			});
			console.error(error);
		},
	});

	const form = useForm<ImportRecipeRequest>({
		resolver: zodResolver(importRecipeSchema.shape.request),
		defaultValues: {
			url: '',
		},
	});

	async function onSubmit() {
		await executeAsync(form.getValues());

		router.refresh();
		form.reset(form.getValues());
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='url'
					render={({ field }) => (
						<FormItem>
							<FormLabel>URL</FormLabel>
							<FormControl>
								<Input
									type='url'
									placeholder='Enter the URL of the recipe you want to import.'
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Type or paste the URL of the recipe you want to import.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' disabled={isExecuting}>
					Import
				</Button>
			</form>
		</Form>
	);
}
