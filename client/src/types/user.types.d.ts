type ActiveUser = {
	id: number;
	givenName: string;
	familyName: string;
	email: string;
	cognitoId: string;
	dateOfBirth?: Date;
	picture?: string;
	isActive: true;
};

type InactiveUser = {
	id: number;
	givenName: string;
	familyName: string;
	dateOfBirth?: Date;
	picture?: string;
	isActive: false;
};

type User = ActiveUser | InactiveUser;
