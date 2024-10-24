import CustomError, { type StatusCode } from './CustomError';

export default class NotFoundError extends CustomError {
	statusCode: StatusCode = 404;

	constructor(public message: string) {
		super(message);
	}

	serialise(): { message: string; statusCode: StatusCode } {
		return {
			message: this.message,
			statusCode: this.statusCode,
		};
	}
}
