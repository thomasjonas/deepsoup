// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, User } from '$lib/auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: Session['user'];
			session?: Session['session'];
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
