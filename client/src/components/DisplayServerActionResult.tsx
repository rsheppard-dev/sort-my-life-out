import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleX } from 'lucide-react';

type Props = {
	title: string;

	result:
		| {
				message: string;

				errors?: Record<string, string[]>;

				success: boolean;
		  }
		| {
				message: unknown;

				success: boolean;

				errors?: undefined;
		  }
		| undefined;
};

function ErrorAlert({
	message,
	title = 'Sorry...',
}: {
	message: string;
	title?: string;
}) {
	return (
		<Alert variant={'destructive'}>
			<CircleX className='h-4 w-4' />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	);
}

function SuccessAlert({ message }: { message: string }) {
	return (
		<Alert>
			<AlertTitle>Success</AlertTitle>
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	);
}

export default function DisplayServerActionResult({ result, title }: Props) {
	const { success } = result ?? {};
	return (
		<>
			{success && typeof result?.message === 'string' ? (
				<SuccessAlert message={result.message} />
			) : null}

			{!success && typeof result?.message === 'string' ? (
				<ErrorAlert message={result.message} title={title} />
			) : null}

			{result?.errors ? (
				<ul className='my-2 text-red-500'>
					{Object.entries(result.errors).map(([key, errors]) =>
						errors.map((error, index) => (
							<li key={`${key}-${index}`}>{error}</li>
						))
					)}
				</ul>
			) : null}
		</>
	);
}
