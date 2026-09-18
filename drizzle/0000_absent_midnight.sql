CREATE TABLE `guests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`dates` text NOT NULL,
	`activities` text NOT NULL,
	`topics` text NOT NULL,
	`vibe` text NOT NULL,
	`about` text NOT NULL,
	`hopes` text NOT NULL,
	`pairing` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
