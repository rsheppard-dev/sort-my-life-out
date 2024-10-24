import CustomError, { type StatusCode } from './CustomError';

export default class BadRequestError extends CustomError {
	statusCode: StatusCode = 400;

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
