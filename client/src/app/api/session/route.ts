import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/config/env.mjs';

export async function GET(req: NextRequest) {
	const cookie = req.cookies.get('connect.sid');

	if (!cookie) {
		return NextResponse.json(
			{
				message: 'Session cookie not found.',
			},
			{ status: 404 }
		);
	}

	const endpoint = `${env.NEXT_PUBLIC_BASE_API_URL}/api/auth`;

	const response = await fetch(endpoint, {
		method: 'GET',
		credentials: 'include', // Ensures the session cookie is included
		headers: {
			'Content-Type': 'application/json',
			Cookie: `${cookie.name}=${cookie.value}`,
		},
	});

	const data = await response.json();

	if (!response.ok) {
		return NextResponse.json(
			{
				message: 'Error fetching session data.',
				response,
			},
			{ status: 500 }
		);
	}

	return NextResponse.json(data);
}
