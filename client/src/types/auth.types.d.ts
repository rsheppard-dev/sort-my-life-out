type Cookie = {
	originalMaxAge: number;
	expires: Date;
	httpOnly: boolean;
	path: string;
};

type UserSession = {
	id: number;
	name: string;
	email: string;
	picture?: string;
};

type Session = {
	cookie: Cookie;
	user: UserSession;
	isAuthenticated: boolean;
};
