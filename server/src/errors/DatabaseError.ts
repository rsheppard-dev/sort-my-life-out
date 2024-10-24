import CustomError, { type StatusCode } from './CustomError';

export default class DatabaseError extends CustomError {
	statusCode: StatusCode = 500;

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
