import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { db } from '$lib/server/db/index';
import * as schema from '$lib/server/db/schema';
import { getRequestEvent } from '$app/server';
import { BETTER_AUTH_SECRET } from '$env/static/private';

export const auth = betterAuth({
	plugins: [sveltekitCookies(getRequestEvent)], // make sure this is the last plugin in the array
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification
		}
	}),
	secret: BETTER_AUTH_SECRET,
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24 // 1 day
	}
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
