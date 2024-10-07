import { Request, Response } from 'express';

export const mockRecipeRequest = {} as Request;

export const mockRecipeResponse = {
	send: jest.fn(),
} as unknown as Response;
