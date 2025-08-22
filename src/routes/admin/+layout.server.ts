import { redirect } from '@sveltejs/kit';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '$env/static/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, cookies }) => {
	const authHeader = request.headers.get('authorization');

	// Check for Basic Auth header
	if (!authHeader || !authHeader.startsWith('Basic ')) {
		// Check for session cookie as fallback
		const sessionCookie = cookies.get('admin_session');
		if (!sessionCookie || sessionCookie !== 'authenticated') {
			// Return 401 with WWW-Authenticate header to trigger browser auth prompt
			throw new Response('Unauthorized', {
				status: 401,
				headers: {
					'WWW-Authenticate': 'Basic realm="Admin Area"'
				}
			});
		}
	} else {
		// Decode Basic Auth header
		const encodedCredentials = authHeader.slice(6);
		const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
		const [username, password] = credentials.split(':');

		// Verify credentials
		if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
			throw new Response('Invalid credentials', {
				status: 401,
				headers: {
					'WWW-Authenticate': 'Basic realm="Admin Area"'
				}
			});
		}

		// Set session cookie for future requests
		cookies.set('admin_session', 'authenticated', {
			httpOnly: true,
			secure: false, // Set to true in production with HTTPS
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: '/'
		});
	}

	// User is authenticated
	return {
		authenticated: true
	};
};
