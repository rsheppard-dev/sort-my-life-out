interface DatabaseError extends Error {
	code?: string;
	constraint?: string;
}
