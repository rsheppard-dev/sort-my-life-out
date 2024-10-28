import Link from 'next/link';
import { Button } from '../ui/button';
import { GoogleOriginal } from 'devicons-react';
import { env } from '@/config/env.mjs';

type LoginWithGoogleProps = {
	isSubmitting: boolean;
};

export default function LoginWithGoogle({
	isSubmitting,
}: LoginWithGoogleProps) {
	return (
		<Button
			asChild
			variant='outline'
			className='flex w-full gap-2'
			disabled={isSubmitting}
		>
			<Link href={env.NEXT_PUBLIC_BASE_API_URL + '/api/auth/google'}>
				<GoogleOriginal /> Login with Google
			</Link>
		</Button>
	);
}
