CREATE TABLE `account` (
	`id` char(30) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	CONSTRAINT `account_id_pk` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `answer` (
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	`id` char(30) NOT NULL,
	`workspace_id` char(30) NOT NULL,
	`submission_id` char(30) NOT NULL,
	`question_id` char(30) NOT NULL,
	CONSTRAINT `answer_workspace_id_id_pk` PRIMARY KEY(`workspace_id`,`id`)
);
--> statement-breakpoint
CREATE TABLE `answer_value` (
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	`id` char(30) NOT NULL,
	`workspace_id` char(30) NOT NULL,
	`answer_id` char(30) NOT NULL,
	`text` varchar(1000),
	`number` bigint,
	`option_id` varchar(26),
	CONSTRAINT `answer_value_workspace_id_id_pk` PRIMARY KEY(`workspace_id`,`id`)
);
--> statement-breakpoint
CREATE TABLE `auth` (
	`id` char(30) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	`provider` enum('email','github','google') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`account_id` char(30) NOT NULL,
	CONSTRAINT `auth_id_pk` PRIMARY KEY(`id`),
	CONSTRAINT `provider` UNIQUE(`provider`,`subject`)
);
--> statement-breakpoint
CREATE TABLE `domain` (
	`id` char(30) NOT NULL,
	`workspace_id` char(30) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	`hostname` varchar(255) NOT NULL,
	`cloudflare_hostname_id` varchar(64),
	CONSTRAINT `domain_workspace_id_id_pk` PRIMARY KEY(`workspace_id`,`id`),
	CONSTRAINT `hostname` UNIQUE(`hostname`)
);
--> statement-breakpoint
CREATE TABLE `file` (
	`id` char(30) NOT NULL,
	`workspace_id` char(30) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	`content_type` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`size` bigint NOT NULL,
	CONSTRAINT `file_workspace_id_id_pk` PRIMARY KEY(`workspace_id`,`id`)
);
--> statement-breakpoint
CREATE TABLE `funnel_file` (
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	`workspace_id` char(30) NOT NULL,
	`funnel_id` char(30) NOT NULL,
	`file_id` char(30) NOT NULL,
	CONSTRAINT `funnel_file_workspace_id_funnel_id_file_id_pk` PRIMARY KEY(`workspace_id`,`funnel_id`,`file_id`)
);
--> statement-breakpoint
CREATE TABLE `funnel` (
	`id` char(30) NOT NULL,
	`workspace_id` char(30) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	`short_id` varchar(8) NOT NULL,
	`title` varchar(255) NOT NULL,
	`settings` json NOT NULL,
	`current_version` int NOT NULL,
	`published_version` int,
	`published_at` timestamp(3),
	CONSTRAINT `funnel_workspace_id_id_pk` PRIMARY KEY(`workspace_id`,`id`),
	CONSTRAINT `short_id` UNIQUE(`short_id`)
);
--> statement-breakpoint
CREATE TABLE `funnel_version` (
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	`workspace_id` char(30) NOT NULL,
	`funnel_id` char(30) NOT NULL,
	`version` int NOT NULL,
	`pages` json NOT NULL,
	`rules` json NOT NULL,
	`variables` json NOT NULL,
	`theme` json NOT NULL,
	`published_at` timestamp(3),
	CONSTRAINT `funnel_version_workspace_id_funnel_id_version_pk` PRIMARY KEY(`workspace_id`,`funnel_id`,`version`)
);
--> statement-breakpoint
CREATE TABLE `question` (
	`id` char(30) NOT NULL,
	`workspace_id` char(30) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	`funnel_id` char(30) NOT NULL,
	`block_id` varchar(26) NOT NULL,
	`type` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`index` int NOT NULL,
	`options` json,
	CONSTRAINT `question_workspace_id_id_pk` PRIMARY KEY(`workspace_id`,`id`),
	CONSTRAINT `funnel_block` UNIQUE(`workspace_id`,`funnel_id`,`block_id`)
);
--> statement-breakpoint
CREATE TABLE `submission` (
	`id` char(30) NOT NULL,
	`workspace_id` char(30) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	`funnel_id` char(30) NOT NULL,
	`session_id` varchar(26) NOT NULL,
	`completed_at` timestamp(3),
	CONSTRAINT `submission_workspace_id_id_pk` PRIMARY KEY(`workspace_id`,`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` char(30) NOT NULL,
	`workspace_id` char(30) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	`account_id` char(30),
	`email` varchar(255),
	`name` varchar(255) NOT NULL,
	`last_seen_at` timestamp(3),
	`role` enum('admin','member') NOT NULL,
	CONSTRAINT `user_workspace_id_id_pk` PRIMARY KEY(`workspace_id`,`id`),
	CONSTRAINT `user_account_id` UNIQUE(`workspace_id`,`account_id`),
	CONSTRAINT `user_email` UNIQUE(`workspace_id`,`email`)
);
--> statement-breakpoint
CREATE TABLE `workspace` (
	`id` char(30) NOT NULL,
	`slug` varchar(255),
	`name` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
	`archived_at` timestamp(3),
	CONSTRAINT `workspace_id` PRIMARY KEY(`id`),
	CONSTRAINT `slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `question` ON `answer` (`workspace_id`,`question_id`);--> statement-breakpoint
CREATE INDEX `answer` ON `answer_value` (`workspace_id`,`answer_id`);--> statement-breakpoint
CREATE INDEX `account_id` ON `auth` (`account_id`);--> statement-breakpoint
CREATE INDEX `funnel` ON `question` (`funnel_id`);--> statement-breakpoint
CREATE INDEX `session` ON `submission` (`session_id`);--> statement-breakpoint
CREATE INDEX `global_account_id` ON `user` (`account_id`);--> statement-breakpoint
CREATE INDEX `global_email` ON `user` (`email`);