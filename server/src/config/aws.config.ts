import env from './env.config';
import { SES } from '@aws-sdk/client-ses';

export const sesClient = new SES({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY,
		secretAccessKey: env.AWS_SECRET_KEY,
	},
});
