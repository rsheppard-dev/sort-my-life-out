'use server';

import { getErrorMessage } from '@/lib/getErrorMessage';
import { actionClient } from '@/lib/safe-action';
import { updateProfileSchema } from '@/schema/user.schema';
import { updateUserAttributes } from 'aws-amplify/auth';

type ActionProps = {
	message?: string;
	success: boolean;
};

export const updateProfileAction = actionClient
	.schema(updateProfileSchema)
	.action(
		async ({
			parsedInput: { givenName, familyName, dateOfBirth },
		}): Promise<ActionProps> => {
			try {
				await updateUserAttributes({
					userAttributes: {
						given_name: givenName,
						family_name: familyName,
						birthdate: dateOfBirth?.toDateString(),
					},
				});

				return {
					success: true,
					message: 'Profile updated successfully.',
				};
			} catch (error) {
				return {
					success: false,
					message: getErrorMessage(error),
				};
			}
		}
	);
