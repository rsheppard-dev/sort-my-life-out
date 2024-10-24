import { apiSlice } from '@/lib/store/api/apiSlice';
import type { CreateUser } from '@/schema/user.schema';

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: builder => ({
		createUser: builder.mutation<User, CreateUser>({
			query: body => ({
				url: '/users',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Users'],
		}),
	}),
});

export const { useCreateUserMutation } = usersApiSlice;
