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

// Keep existing user table for compatibility
export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	age: integer('age')
});
