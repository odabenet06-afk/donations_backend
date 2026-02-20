CREATE DATABASE IF NOT EXISTS openHands;

USE openHands;

CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entity_type` enum('donor','donation','expense','email') COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` enum('create','update','delete','void','sent','failed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `changed_by_username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `changed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `before_value` json DEFAULT NULL,
  `after_value` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `changed_by_user_id` (`changed_by_username`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `donations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` decimal(15,2) NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'MKD',
  `donor_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donation_purpose` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'General',
  `receipt_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `donor_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','void') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_by_username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `donor_id` (`donor_id`),
  KEY `created_by_username` (`created_by_username`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `donors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donor_public_id` varchar(25) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `privacy_preference` enum('SHOW_NAME_PUBLICLY','SHOW_ID_ONLY') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SHOW_ID_ONLY',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','void') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `donor_public_id` (`donor_public_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` decimal(15,2) NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'MKD',
  `category` enum('Salary','Office materials','Transportation','Family support','Project investment','Other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachment_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by_username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','void') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_name`),
  KEY `created_by_user_id` (`created_by_username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('planned','active','completed','void') COLLATE utf8mb4_unicode_ci DEFAULT 'planned',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `system_stats` (
  `id` int NOT NULL DEFAULT '1',
  `total_donors` int DEFAULT '0',
  `total_donations_count` int DEFAULT '0',
  `total_amount_received` decimal(15,2) DEFAULT '0.00',
  `total_amount_spent` decimal(15,2) DEFAULT '0.00',
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','staff') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'staff',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  en VARCHAR(255) NOT NULL,
  sq VARCHAR(255) NOT NULL,
  mk VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO category (en, sq, mk)
VALUES
('Salary', 'Paga', 'Плата'),
('Office materials', 'Materiale zyre', 'Канцелариски материјали'),
('Transportation', 'Transporti', 'Транспорт'),
('Family support', 'Përkrahje familjare', 'Семејна поддршка'),
('Project investment', 'Investim në projekt', 'Инвестиција во проект');

-- This inserts the user admin with the password admin123
INSERT INTO `users` (`username`, `password_hash`, `role`)
VALUES ('admin', '$2b$10$YMbaySNxd4sNVwOFrmsiaOsJQKx.oz7CQlmSxjdQ3zP.fPHl71Omi', 'admin');

-- This starts the system stats
INSERT INTO `system_stats` (`id`, `total_donors`, `total_donations_count`, `total_amount_received`, `total_amount_spent`)
VALUES (1, 0, 0, 0.00, 0.00)
