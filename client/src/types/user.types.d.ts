type ActiveUser = {
	id: number;
	givenName: string;
	familyName: string;
	email: string;
	emailVerified: boolean;
	dateOfBirth?: Date;
	picture?: string;
	isActive: true;
	isPro: boolean;
	createdAt: Date;
	updatedAt: Date;
};

type InactiveUser = {
	id: number;
	givenName: string;
	familyName: string;
	dateOfBirth?: Date;
	picture?: string;
	isActive: false;
	createdAt: Date;
	updatedAt: Date;
};

type User = ActiveUser | InactiveUser;
