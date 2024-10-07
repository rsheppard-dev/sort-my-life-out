import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json, colorize, printf } = format;

const consoleLogFormat = combine(
	colorize(),
	printf(({ level, message, timestamp }) => `${level}: ${message}`)
);

const logger = createLogger({
	level: 'info',
	format: combine(colorize(), timestamp(), json()),
	transports: [
		new transports.Console({
			format: consoleLogFormat,
		}),
	],
});

export default logger;
