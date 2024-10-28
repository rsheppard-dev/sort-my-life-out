import { getSession } from '@/actions/auth.actions';
import React from 'react';

export default async function page() {
	const session = await getSession();

	return (
		<div className='grid gap-4'>
			<h1>Welcome {session?.user?.name}.</h1>
			<div className='mx-auto bg-gray-200 rounded-lg p-4'>
				{JSON.stringify(session)}
			</div>
		</div>
	);
}
