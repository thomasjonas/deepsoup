import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Videos uploaded by users
export const videos = sqliteTable('videos', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	bunnyVideoId: text('bunny_video_id').unique(),
	originalFilename: text('original_filename').notNull(),
	title: text('title'),
	aiDescription: text('ai_description'),
	duration: real('duration'), // in seconds
	fileSize: integer('file_size'), // in bytes
	userName: text('user_name').notNull(),
	userEmail: text('user_email').notNull(),
	instagramHandle: text('instagram_handle'),
	uploadDate: integer('upload_date', { mode: 'timestamp' }).notNull(),
	status: text('status').notNull().default('uploading'), // uploading, processing, ready, failed
	thumbnailUrls: text('thumbnail_urls'), // JSON array of screenshot URLs
	bunnyStreamUrl: text('bunny_stream_url'),
	downloadUrl: text('download_url')
});

// Site content that can be edited by admin
export const siteContent = sqliteTable('site_content', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	key: text('key').unique().notNull(), // colophon, screening_dates, etc.
	content: text('content').notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

// Better Auth tables
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
	image: text('image'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
	ipAddress: text('ipAddress'),
	userAgent: text('userAgent'),
	userId: text('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const account = sqliteTable('account', {
	id: text('id').primaryKey(),
	accountId: text('accountId').notNull(),
	providerId: text('providerId').notNull(),
	userId: text('userId')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('accessToken'),
	refreshToken: text('refreshToken'),
	idToken: text('idToken'),
	accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
	refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull()
});

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }),
	updatedAt: integer('updatedAt', { mode: 'timestamp' })
});
