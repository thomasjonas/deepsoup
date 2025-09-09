import { auth } from '$lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building, dev } from '$app/environment';
// import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
// import { drizzle as drizzleLibSQL } from 'drizzle-orm/libsql';
// import { createClient } from '@libsql/client';
// import * as schema from '$lib/server/db/schema';
// import { env } from '$env/dynamic/private';

export async function handle({ event, resolve }) {
	// if (dev) {
	// 	if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
	// 	const client = createClient({ url: env.DATABASE_URL });
	// 	event.locals.db = drizzleLibSQL(client, { schema });
	// } else {
	// 	event.locals.db = drizzleD1(event.platform?.env.DB, { schema });
	// }

	// await auth.api.signUpEmail({
	// 	body: {
	// 		email: 'info@thomasboland.nl',
	// 		password: 'password',
	// 		name: 'Admin'
	// 	}
	// });

	// Fetch current session from Better Auth
	// const session = await auth.api.getSession({
	// 	headers: event.request.headers
	// });

	// // Make session and user available on server
	// if (session) {
	// 	event.locals.session = session.session;
	// 	event.locals.user = session.user;
	// }

	return svelteKitHandler({ event, resolve, auth, building });
}
