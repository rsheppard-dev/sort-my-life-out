import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type ParsedCookie = {
	value: string | null;
	expires?: string;
	path?: string;
	httpOnly?: boolean;
	secure?: boolean;
};

export function parseCookieString(
	cookieString: string,
	cookieName: string
): ParsedCookie {
	const result: ParsedCookie = { value: null };
	const parts = cookieString.split(';');

	// Extract the main cookie value
	const cookiePart = parts.find(part =>
		part.trim().startsWith(`${cookieName}=`)
	);
	if (cookiePart) {
		const [name, value] = cookiePart.split('=');
		if (name && value) {
			result.value = value;
		}
	}

	// Extract other attributes (Expires, Path, HttpOnly, Secure)
	for (let i = 1; i < parts.length; i++) {
		const [attrName, attrValue] = parts[i].trim().split('=');
		switch (attrName.toLowerCase()) {
			case 'expires':
				result.expires = attrValue;
				break;
			case 'path':
				result.path = attrValue;
				break;
			case 'httponly':
				result.httpOnly = true;
				break;
			case 'secure':
				result.secure = true;
				break;
		}
	}

	return result;
}
