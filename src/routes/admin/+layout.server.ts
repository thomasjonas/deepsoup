import { auth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, url }) => {
	// Get session from Better Auth
	const session = await auth.api.getSession({
		headers: request.headers
	});

	// If no valid session, redirect to login
	if (!session?.session) {
		throw redirect(302, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	// User is authenticated
	return {
		user: session.user
	};
};
