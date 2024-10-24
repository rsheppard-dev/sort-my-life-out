export type StatusCode = 400 | 401 | 403 | 404 | 409 | 500;

export default abstract class CustomError extends Error {
	public readonly isOperational: boolean;

	constructor(public message: string) {
		super(message);

		this.isOperational = true;

		Object.setPrototypeOf(this, new.target.prototype);
		Error.captureStackTrace(this);
	}
	abstract statusCode: StatusCode;
	abstract serialise(): {
		message: string;
		statusCode: StatusCode;
	};
}
