import { dev } from '$app/environment';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://72bb061f1d75fad6034806c060b7246c@o4510079347064832.ingest.de.sentry.io/4510079348506704',
	enabled: !dev,

	// Enable logs to be sent to Sentry
	enableLogs: true

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: import.meta.env.DEV,
});
