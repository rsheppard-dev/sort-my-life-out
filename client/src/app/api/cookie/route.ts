import { NextResponse, NextRequest } from 'next/server';

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

	return NextResponse.json(cookie);
}
