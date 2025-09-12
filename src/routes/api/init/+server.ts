import { auth } from '$lib/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { name, email, password } = await request.json();
	const numUsers = await db.$count(user);

	if (numUsers === 0) {
		const result = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name
			}
		});
		return json({ result });
	} else {
		return error(400, 'First user already exists!');
	}
};
