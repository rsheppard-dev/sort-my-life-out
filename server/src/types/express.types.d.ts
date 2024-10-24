import express from 'express';

declare global {
	namespace Express {
		interface User {
			id: string;
			name: string;
			email: string;
			picture?: string;
		}
	}
}
