import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { db } from './server/db/index';
import * as schema from './server/db/schema';
import { getRequestEvent } from '$app/server';

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
