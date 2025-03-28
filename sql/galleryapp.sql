CREATE DATABASE galleryapp;
USE galleryapp;

CREATE USER 'galleryadmin'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON galleryapp.* TO 'galleryadmin'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('standard','premium') DEFAULT 'standard',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `token_blacklist` (
  `token_id` varchar(255) NOT NULL,
  `revoked_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`token_id`)
);

