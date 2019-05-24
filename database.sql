SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `message` (
  `msgid` int(11) NOT NULL,
  `shoutboxid` int(11) NOT NULL DEFAULT 1,
  `userid` int(11) NOT NULL,
  `content` varchar(200) NOT NULL,
  `appear` int(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `shoutbox` (
  `id` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `motd` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `shoutbox` (`id`, `title`, `motd`) VALUES
(1, 'Default', 'Default MOTD');



CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` varchar(10) NOT NULL DEFAULT '''member''',
  `avatar` varchar(20) NOT NULL DEFAULT 'default.jpg',
  `shoutboxid` int(11) NOT NULL DEFAULT 1,
  `ban` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `message`
  ADD PRIMARY KEY (`msgid`);


ALTER TABLE `shoutbox`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `message`
  MODIFY `msgid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=336;


ALTER TABLE `shoutbox`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

