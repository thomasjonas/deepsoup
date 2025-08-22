CREATE TABLE `site_content` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`content` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_content_key_unique` ON `site_content` (`key`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`age` integer
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bunny_video_id` text,
	`original_filename` text NOT NULL,
	`title` text,
	`ai_description` text,
	`duration` real,
	`file_size` integer,
	`user_name` text NOT NULL,
	`user_email` text NOT NULL,
	`instagram_handle` text,
	`upload_date` integer NOT NULL,
	`status` text DEFAULT 'uploading' NOT NULL,
	`thumbnail_urls` text,
	`bunny_stream_url` text,
	`download_url` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `videos_bunny_video_id_unique` ON `videos` (`bunny_video_id`);