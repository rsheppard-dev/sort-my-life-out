import { formatDuration } from 'date-fns';

export function formatISO8601Duration(duration?: string) {
	if (!duration) return;

	const match = duration.match(
		/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
	);
	if (!match) return duration;

	const [, days, hours, minutes, seconds] = match.map(Number);
	const durationObject = {
		days: days || 0,
		hours: hours || 0,
		minutes: minutes || 0,
		seconds: seconds || 0,
	};

	return formatDuration(durationObject);
}

export function generateVerificationCode(size: number): number {
	const min = Math.pow(10, size - 1);
	const max = Math.pow(10, size) - 1;
	return Math.floor(min + Math.random() * (max - min + 1));
}
