import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.TURSO_CONNECTION_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!
	},
	verbose: true,
	strict: true
});
