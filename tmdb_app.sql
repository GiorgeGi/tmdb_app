-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 25, 2025 at 11:59 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tmdb_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_tokens`
--

CREATE TABLE `auth_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_tokens`
--

INSERT INTO `auth_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(1, 4, 'bbd2116ea5af2841f2c1d1a555c612b4', '2025-08-29 22:58:56', '2025-08-22 20:58:56'),
(2, 4, '1c29cb0144a85b94a2b11e6524460459', '2025-08-29 22:59:12', '2025-08-22 20:59:12'),
(3, 4, 'f16e82351190b844e36c52846f6af390', '2025-08-29 23:29:04', '2025-08-22 21:29:04'),
(4, 4, '22771276b9d85fda5a20f8624ca97e28', '2025-08-29 23:39:25', '2025-08-22 21:39:25'),
(5, 4, 'da8164121df707e35222b514de16502d', '2025-08-29 23:47:51', '2025-08-22 21:47:51'),
(6, 5, '04f708c32a5d94a8edee4d04bdfc32ed', '2025-08-29 23:58:43', '2025-08-22 21:58:43'),
(7, 6, '2eff949e4a3e449b18e2f0fb8da38ee4', '2025-08-30 00:04:19', '2025-08-22 22:04:19'),
(8, 4, '71f98b945a0571c8727d2e8b388d6160', '2025-08-30 00:16:19', '2025-08-22 22:16:19'),
(9, 4, '5935098f0d35354646aa528f8b2f7f8a', '2025-08-30 10:27:31', '2025-08-23 08:27:31'),
(10, 4, '10feddf04995a44c1d9df7e093d06d4f', '2025-08-30 10:31:41', '2025-08-23 08:31:41'),
(11, 4, '3145c06ce0542be98b8dc141604e6a3b', '2025-08-30 10:57:33', '2025-08-23 08:57:33'),
(12, 5, '8a6dbbe55937ef80bbdf4bfcd66786b0', '2025-08-30 11:00:17', '2025-08-23 09:00:17'),
(13, 6, 'c9fa20e9afdf1d199e0e9d7abe384d99', '2025-08-30 11:00:55', '2025-08-23 09:00:55'),
(14, 4, 'eb04f120392ca836a2dd30d112f167f7', '2025-08-30 16:07:38', '2025-08-23 14:07:38'),
(15, 4, '240d325626ab57ca3f66d0ef22cf6ea6', '2025-08-30 16:33:05', '2025-08-23 14:33:05'),
(16, 5, 'b371f63003884169b49d0497255a79af', '2025-08-30 16:45:35', '2025-08-23 14:45:35'),
(17, 6, 'f366ee8c2a0eac1bcbf93415097ab40f', '2025-08-30 16:49:10', '2025-08-23 14:49:10'),
(18, 6, 'f1a4d8f0a88a22e330076da1deb4aad1', '2025-08-31 22:30:30', '2025-08-24 20:30:30'),
(19, 5, '66c1e2b62f75a240a31c47317bb26f65', '2025-08-31 22:53:59', '2025-08-24 20:53:59');

-- --------------------------------------------------------

--
-- Table structure for table `custom_items`
--

CREATE TABLE `custom_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `type` enum('movie','tv') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `custom_items`
--

INSERT INTO `custom_items` (`id`, `user_id`, `title`, `description`, `image_url`, `type`, `created_at`, `updated_at`) VALUES
(8, 5, 'frog', 'frogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrogfrog', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD0R7D0xWDwkKy3HJVbH_k-926TnLtSFa1mA&s', 'movie', '2025-08-26 00:43:43', '2025-08-26 00:43:43');

-- --------------------------------------------------------

--
-- Table structure for table `episodes`
--

CREATE TABLE `episodes` (
  `id` int(11) NOT NULL,
  `season_id` int(11) NOT NULL,
  `episode_number` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `overview` text DEFAULT NULL,
  `air_date` date DEFAULT NULL,
  `runtime` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `tmdb_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `year` year(4) DEFAULT NULL,
  `poster_path` varchar(255) DEFAULT NULL,
  `overview` text DEFAULT NULL,
  `is_custom` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `tmdb_id`, `title`, `year`, `poster_path`, `overview`, `is_custom`, `created_at`, `updated_at`) VALUES
(2, 1061474, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-23 08:57:36', '2025-08-23 08:57:36'),
(3, 575265, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-23 09:00:24', '2025-08-23 09:00:24'),
(9, 1087192, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-23 16:01:56', '2025-08-23 16:01:56'),
(10, 803796, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-25 15:09:55', '2025-08-25 15:09:55'),
(11, 1151334, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-25 15:10:16', '2025-08-25 15:10:16'),
(12, 755898, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-25 15:10:30', '2025-08-25 15:10:30'),
(13, 1311031, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-25 15:10:36', '2025-08-25 15:10:36'),
(14, 911430, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-25 16:48:20', '2025-08-25 16:48:20'),
(15, 617126, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-25 19:42:52', '2025-08-25 19:42:52'),
(16, 1234821, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-25 20:20:32', '2025-08-25 20:20:32');

-- --------------------------------------------------------

--
-- Table structure for table `seasons`
--

CREATE TABLE `seasons` (
  `id` int(11) NOT NULL,
  `tv_show_id` int(11) NOT NULL,
  `season_number` int(11) NOT NULL,
  `air_date` date DEFAULT NULL,
  `overview` text DEFAULT NULL,
  `poster_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tv_shows`
--

CREATE TABLE `tv_shows` (
  `id` int(11) NOT NULL,
  `tmdb_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `first_air_date` date DEFAULT NULL,
  `poster_path` varchar(255) DEFAULT NULL,
  `overview` text DEFAULT NULL,
  `is_custom` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tv_shows`
--

INSERT INTO `tv_shows` (`id`, `tmdb_id`, `title`, `first_air_date`, `poster_path`, `overview`, `is_custom`, `created_at`, `updated_at`) VALUES
(2, 119051, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-23 09:01:04', '2025-08-23 09:01:04'),
(3, 79744, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-23 15:29:13', '2025-08-23 15:29:13'),
(4, 196890, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-25 15:09:46', '2025-08-25 15:09:46'),
(5, 456, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-25 15:10:05', '2025-08-25 15:10:05'),
(6, 2734, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-25 15:10:48', '2025-08-25 15:10:48'),
(7, 157239, 'Placeholder', NULL, NULL, NULL, 0, '2025-08-25 20:30:50', '2025-08-25 20:30:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
(2, 'testuser', 'testuser@example.com', '$2y$10$e0NRlY5j0fYbGQxYJ1R2eOl9kK1z6J1u9FhGZnE8kz/YhG3pQm1aG', 'user', '2025-07-21 10:11:14', '2025-07-21 10:11:14'),
(3, 'susybaka', 'susybaka@gmail.com', '$2y$10$v2OfXU8wxnWTr/lVIgh4IONzoF9xRoNLHGWDvXxYyX6cOWv0CqD/W', 'user', '2025-07-21 10:30:47', '2025-07-21 10:30:47'),
(4, 'yolo', 'yolo@yes.com', '$2y$10$oGD3D7xtAh6kwgt8Kxtnv.Ot1oGEQ47xscldLLdCszgAWW2fV/HoC', 'user', '2025-08-20 20:22:26', '2025-08-20 20:22:26'),
(5, 'yolo2', 'yolo2@yeah.com', '$2y$10$60Gs9cGuvSbVdiL2TMs0q.ztrtfhT12U6NhKmZ.mSTlred9d1nYoO', 'user', '2025-08-20 20:45:58', '2025-08-20 20:45:58'),
(6, 'yolo3', 'yolo3@test.com', '$2y$10$P8BSpPGlUCfkh/F1G.EE4e8Xh0DPt5aV9jWitSj.WrU6kKMa2wpuG', 'user', '2025-08-22 22:04:09', '2025-08-22 22:04:09');

-- --------------------------------------------------------

--
-- Table structure for table `user_items`
--

CREATE TABLE `user_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tmdb_id` int(11) DEFAULT NULL,
  `type` enum('movie','tv') NOT NULL,
  `is_favorite` tinyint(1) DEFAULT 0,
  `list_type` enum('watchlist','watched') DEFAULT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `custom_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_items`
--

INSERT INTO `user_items` (`id`, `user_id`, `tmdb_id`, `type`, `is_favorite`, `list_type`, `note`, `created_at`, `updated_at`, `custom_id`) VALUES
(1, 4, 1061474, 'movie', 1, 'watched', NULL, '2025-08-23 08:57:36', '2025-08-23 08:59:47', NULL),
(5, 6, 119051, 'tv', 1, 'watchlist', 'yeah', '2025-08-23 09:01:04', '2025-08-24 20:53:38', NULL),
(28, 5, 1311031, 'movie', 1, 'watched', '', '2025-08-25 15:10:36', '2025-08-25 20:53:09', NULL),
(34, 5, 911430, 'movie', 0, NULL, NULL, '2025-08-25 16:48:20', '2025-08-25 16:48:27', NULL),
(35, 5, 575265, 'movie', 0, 'watched', NULL, '2025-08-25 16:48:43', '2025-08-25 21:53:31', NULL),
(44, 5, NULL, 'movie', 0, 'watchlist', 'frog', '2025-08-25 21:43:43', '2025-08-25 21:45:53', 8);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_auth_tokens_token` (`token`),
  ADD KEY `idx_auth_tokens_user_id` (`user_id`);

--
-- Indexes for table `custom_items`
--
ALTER TABLE `custom_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `episodes`
--
ALTER TABLE `episodes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_episodes_season_id` (`season_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_movies_tmdb_id` (`tmdb_id`);

--
-- Indexes for table `seasons`
--
ALTER TABLE `seasons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_seasons_tv_show_id` (`tv_show_id`);

--
-- Indexes for table `tv_shows`
--
ALTER TABLE `tv_shows`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_tv_shows_tmdb_id` (`tmdb_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_users_username` (`username`),
  ADD UNIQUE KEY `uniq_users_email` (`email`);

--
-- Indexes for table `user_items`
--
ALTER TABLE `user_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_item_unique` (`user_id`,`tmdb_id`,`type`),
  ADD KEY `custom_id` (`custom_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `custom_items`
--
ALTER TABLE `custom_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `episodes`
--
ALTER TABLE `episodes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `seasons`
--
ALTER TABLE `seasons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tv_shows`
--
ALTER TABLE `tv_shows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_items`
--
ALTER TABLE `user_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `auth_tokens`
--
ALTER TABLE `auth_tokens`
  ADD CONSTRAINT `fk_auth_tokens_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `custom_items`
--
ALTER TABLE `custom_items`
  ADD CONSTRAINT `custom_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `episodes`
--
ALTER TABLE `episodes`
  ADD CONSTRAINT `fk_episodes_seasons` FOREIGN KEY (`season_id`) REFERENCES `seasons` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seasons`
--
ALTER TABLE `seasons`
  ADD CONSTRAINT `fk_seasons_tv_shows` FOREIGN KEY (`tv_show_id`) REFERENCES `tv_shows` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_items`
--
ALTER TABLE `user_items`
  ADD CONSTRAINT `user_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_items_ibfk_2` FOREIGN KEY (`custom_id`) REFERENCES `custom_items` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
