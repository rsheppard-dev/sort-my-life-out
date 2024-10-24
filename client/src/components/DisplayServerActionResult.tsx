import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleX } from 'lucide-react';

type Props = {
	result: {
		data?: {
			message?: string;
			success?: boolean;
		};
		serverError?: string;
		fetchError?: string;
		validationErrors?: Record<string, string[] | undefined> | undefined;
	};
	title?: string;
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
	const { data, serverError, fetchError, validationErrors } = result;

	return (
		<>
			{data?.message ? <SuccessAlert message={data.message} /> : null}

			{serverError ? <ErrorAlert message={serverError} title={title} /> : null}

			{fetchError ? <ErrorAlert message={fetchError} title={title} /> : null}

			{validationErrors ? (
				<ul className='my-2 text-red-500'>
					{Object.keys(validationErrors).map(key => (
						<li key={key}>
							{`${key}: ${
								validationErrors &&
								validationErrors[key as keyof typeof validationErrors]
							}`}
						</li>
					))}
				</ul>
			) : null}
		</>
	);
}
