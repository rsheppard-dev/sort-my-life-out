import express from 'express';

declare global {
	namespace Express {
		interface User {
			id: number;
			name: string;
			email: string;
			picture?: string;
		}
	}
}
