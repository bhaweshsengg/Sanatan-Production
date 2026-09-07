CREATE TABLE IF NOT EXISTS `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `role` ENUM('Admin', 'TempleManager', 'BusinessManager') NOT NULL DEFAULT 'Admin',
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `User_username_key` (`username`),
  UNIQUE INDEX `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `temple_city` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `temple_city_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `temple_deity` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `temple_deity_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `temple_temple` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mandir_name` VARCHAR(191) NOT NULL,
  `status` ENUM('Pending', 'Approved', 'Delist', 'Rejected') NOT NULL DEFAULT 'Pending',
  `full_address` VARCHAR(191) NOT NULL,
  `city_id` INT NOT NULL,
  `year_established` INT NOT NULL,
  `main_deity_id` INT NOT NULL,
  `description` LONGTEXT NOT NULL,
  `phone_no` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `website` VARCHAR(191) NOT NULL,
  `opening_hours` VARCHAR(191) NOT NULL,
  `service_offered` LONGTEXT NOT NULL,
  `facilities_offered` LONGTEXT NOT NULL,
  `your_name` VARCHAR(191) NOT NULL,
  `your_email` VARCHAR(191) NOT NULL,
  `rating` DOUBLE NOT NULL DEFAULT 0,
  `location` VARCHAR(191) NOT NULL,
  `role` VARCHAR(191) NOT NULL DEFAULT 'devotee',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `temple_temple_email_key` (`email`),
  INDEX `temple_temple_city_id_fkey` (`city_id`),
  INDEX `temple_temple_main_deity_id_fkey` (`main_deity_id`),
  CONSTRAINT `temple_temple_city_id_fkey`
    FOREIGN KEY (`city_id`) REFERENCES `temple_city`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `temple_temple_main_deity_id_fkey`
    FOREIGN KEY (`main_deity_id`) REFERENCES `temple_deity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `temple_templeimage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `temple_id` INT NOT NULL,
  `file` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `temple_templeimage_temple_id_fkey` (`temple_id`),
  CONSTRAINT `temple_templeimage_temple_id_fkey`
    FOREIGN KEY (`temple_id`) REFERENCES `temple_temple`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `business_business` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `businessName` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `address` VARCHAR(191) NOT NULL,
  `city` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `website` VARCHAR(191) NULL,
  `ownerName` VARCHAR(191) NOT NULL,
  `ownerEmail` VARCHAR(191) NOT NULL,
  `ownerPhone` VARCHAR(191) NOT NULL,
  `services` VARCHAR(191) NULL,
  `operatingHours` VARCHAR(191) NULL,
  `specialOffers` VARCHAR(191) NULL,
  `facebookUrl` VARCHAR(191) NULL,
  `instagramUrl` VARCHAR(191) NULL,
  `twitterUrl` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL,
  `approvedat` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL,
  `reviewedat` DATETIME(3) NULL,
  `reviewnotes` VARCHAR(191) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `relation_to_mandir` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `relationship_name` VARCHAR(191) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `relation_to_mandir_relationship_name_key` (`relationship_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_mandir_registration` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(191) NOT NULL,
  `last_name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `mobile` VARCHAR(191) NOT NULL,
  `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  `relation_id` INT NOT NULL,
  `mandir_id` INT NOT NULL,
  `reviewed_by_user_id` INT NULL,
  `reviewed_at` DATETIME(3) NULL,
  `notes` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_mandir_registration_mandir_id_status_idx` (`mandir_id`, `status`),
  INDEX `user_mandir_registration_relation_id_status_idx` (`relation_id`, `status`),
  INDEX `user_mandir_registration_status_idx` (`status`),
  INDEX `user_mandir_registration_email_idx` (`email`),
  CONSTRAINT `user_mandir_registration_relation_id_fkey`
    FOREIGN KEY (`relation_id`) REFERENCES `relation_to_mandir`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `user_mandir_registration_mandir_id_fkey`
    FOREIGN KEY (`mandir_id`) REFERENCES `temple_temple`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `user_mandir_registration_reviewed_by_user_id_fkey`
    FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `relation_to_mandir` (`relationship_name`, `is_active`) VALUES
  ('Temple Admin', TRUE),
  ('Temples Coordinator', TRUE),
  ('Temple Devotee', TRUE)
ON DUPLICATE KEY UPDATE `is_active` = VALUES(`is_active`);
