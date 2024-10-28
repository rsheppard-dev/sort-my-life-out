import { useState, useEffect } from 'react';

export default function useSession() {
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				setIsLoading(true);
				const response = await fetch('/api/session', {
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error('Failed to fetch session.');
				}

				const data: Session = await response.json();
				setSession(data);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: 'An error occurred getting the session.'
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchSession();
	}, []);

	return { session, isLoading, error };
}
