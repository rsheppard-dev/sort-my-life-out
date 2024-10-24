import { env } from '@/config/env.mjs';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchAuthSession } from 'aws-amplify/auth';

const baseUrl = env.NEXT_PUBLIC_BASE_API_URL + '/api';

export const apiSlice = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl,
		prepareHeaders: async headers => {
			const session = await fetchAuthSession();
			const { accessToken } = session.tokens ?? {};

			if (accessToken) {
				headers.set('Authorization', `Bearer ${accessToken}`);
			}
			return headers;
		},
	}),
	tagTypes: ['Users', 'Recipes'],
	endpoints: () => ({}),
});
