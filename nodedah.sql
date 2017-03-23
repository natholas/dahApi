-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 23, 2017 at 10:43 AM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 7.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodedah`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `commentId` int(11) NOT NULL,
  `entrepreneurId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `comment` longtext,
  `createdTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('LIVE','REMOVED') NOT NULL,
  `parentCommentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `countryId` int(11) NOT NULL,
  `countryName` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`countryId`, `countryName`) VALUES
(1, 'Uganda');

-- --------------------------------------------------------

--
-- Stand-in structure for view `entrepreneur`
--
CREATE TABLE `entrepreneur` (
`entrepreneurId` int(11)
,`name` varchar(45)
,`description` longtext
,`dob` date
,`city` varchar(45)
,`countryId` int(11)
,`status` enum('DRAFT','LIVE','ENDED')
,`teamId` int(11)
,`createdTime` datetime
,`fundedTime` datetime
,`teamName` varchar(45)
,`countryName` varchar(45)
);

-- --------------------------------------------------------

--
-- Table structure for table `entrepreneurs`
--

CREATE TABLE `entrepreneurs` (
  `entrepreneurId` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` longtext,
  `dob` date DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `countryId` int(11) DEFAULT NULL,
  `status` enum('DRAFT','LIVE','ENDED') DEFAULT NULL,
  `teamId` int(11) DEFAULT NULL,
  `createdTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `fundedTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `entrepreneurs`
--

INSERT INTO `entrepreneurs` (`entrepreneurId`, `name`, `description`, `dob`, `city`, `countryId`, `status`, `teamId`, `createdTime`, `fundedTime`) VALUES
(1, 'Silas', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultricies porttitor molestie. Duis pulvinar mi ut nisi finibus rutrum. Sed vel rhoncus magna. Curabitur id turpis sit amet tortor commodo mollis viverra in quam. Suspendisse ultricies lacus dolor, a luctus sem laoreet in. Nam in vulputate nunc, quis pulvinar diam. Suspendisse eu velit nisl. Nulla venenatis lacus ac eleifend mollis. Etiam non gravida turpis. Phasellus molestie, orci et consectetur ornare, elit elit tempus dui, at volutpat metus erat eget purus. Duis ornare aliquam nunc, ac sollicitudin purus suscipit in. Sed nec dolor sit amet nulla imperdiet mattis ut vel mauris. Aliquam accumsan lorem id accumsan consequat.', '2010-10-23', 'London', 1, 'LIVE', 1, '2017-03-23 00:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `entrepreneurId` int(11) DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `donationAmout` float DEFAULT NULL,
  `orderTime` datetime DEFAULT NULL,
  `status` enum('INIT','AUTHORIZED','DONE','CANCELLED') DEFAULT NULL,
  `message` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `saferpaylog`
--

CREATE TABLE `saferpaylog` (
  `logId` int(11) NOT NULL,
  `orderId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `teammembers`
--

CREATE TABLE `teammembers` (
  `teamMemberId` int(11) NOT NULL,
  `teamId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` enum('PENDING','ACCEPTED') NOT NULL,
  `joinedTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `teammembers`
--

INSERT INTO `teammembers` (`teamMemberId`, `teamId`, `userId`, `status`, `joinedTime`) VALUES
(1, 1, 1, 'ACCEPTED', '2017-03-23 10:26:03');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `teamId` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` longtext,
  `status` enum('ACTIVE','INACTIVE') DEFAULT NULL,
  `teamLeaderId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`teamId`, `name`, `description`, `status`, `teamLeaderId`) VALUES
(1, 'dignity and hope', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `emailAddress` varchar(45) NOT NULL,
  `nickname` varchar(45) DEFAULT NULL,
  `password` varchar(128) NOT NULL,
  `role` enum('USER','ADMIN') NOT NULL,
  `status` enum('ACTIVE','BLOCKED') NOT NULL,
  `createdTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastLoginTime` datetime DEFAULT NULL,
  `publicStatus` enum('PUBLIC','PRIVATE') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `emailAddress`, `nickname`, `password`, `role`, `status`, `createdTime`, `lastLoginTime`, `publicStatus`) VALUES
(1, 'info@nathanfelix.com', NULL, 'sha1$7b55dd59$1$23f8668516f9a4d54a32f3e1f2c152f0796bbd29', 'ADMIN', 'ACTIVE', '2017-03-23 10:24:09', NULL, 'PUBLIC');

-- --------------------------------------------------------

--
-- Structure for view `entrepreneur`
--
DROP TABLE IF EXISTS `entrepreneur`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `entrepreneur`  AS  select `entrepreneurs`.`entrepreneurId` AS `entrepreneurId`,`entrepreneurs`.`name` AS `name`,`entrepreneurs`.`description` AS `description`,`entrepreneurs`.`dob` AS `dob`,`entrepreneurs`.`city` AS `city`,`entrepreneurs`.`countryId` AS `countryId`,`entrepreneurs`.`status` AS `status`,`entrepreneurs`.`teamId` AS `teamId`,`entrepreneurs`.`createdTime` AS `createdTime`,`entrepreneurs`.`fundedTime` AS `fundedTime`,`teams`.`name` AS `teamName`,`countries`.`countryName` AS `countryName` from ((`entrepreneurs` join `teams` on((`teams`.`teamId` = `entrepreneurs`.`teamId`))) join `countries` on((`countries`.`countryId` = `entrepreneurs`.`countryId`))) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`commentId`),
  ADD UNIQUE KEY `commentId_UNIQUE` (`commentId`),
  ADD KEY `commentAuthorId_idx` (`userId`),
  ADD KEY `commentEntrepreneurId_idx` (`entrepreneurId`),
  ADD KEY `commentParentId_idx` (`parentCommentId`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`countryId`),
  ADD UNIQUE KEY `countryId_UNIQUE` (`countryId`);

--
-- Indexes for table `entrepreneurs`
--
ALTER TABLE `entrepreneurs`
  ADD PRIMARY KEY (`entrepreneurId`),
  ADD UNIQUE KEY `entrepreneurId_UNIQUE` (`entrepreneurId`),
  ADD KEY `entrepreneurTeamId_idx` (`teamId`),
  ADD KEY `entrepreneurNameIndex` (`name`),
  ADD KEY `entrepreneurCountryId_idx` (`countryId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD UNIQUE KEY `orderId_UNIQUE` (`orderId`),
  ADD KEY `orderUserId_idx` (`userId`),
  ADD KEY `orderEntrepreneurId_idx` (`entrepreneurId`);

--
-- Indexes for table `saferpaylog`
--
ALTER TABLE `saferpaylog`
  ADD PRIMARY KEY (`logId`),
  ADD UNIQUE KEY `logId_UNIQUE` (`logId`),
  ADD KEY `saferPayOrderId_idx` (`orderId`);

--
-- Indexes for table `teammembers`
--
ALTER TABLE `teammembers`
  ADD PRIMARY KEY (`teamMemberId`),
  ADD UNIQUE KEY `teamMemberId_UNIQUE` (`teamMemberId`),
  ADD KEY `teamMemberUserId_idx` (`userId`),
  ADD KEY `teamMemberTeamId_idx` (`teamId`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`teamId`),
  ADD UNIQUE KEY `teamId_UNIQUE` (`teamId`),
  ADD KEY `teamLeaderId_idx` (`teamLeaderId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `user_id_UNIQUE` (`userId`),
  ADD KEY `emailAddressIndex` (`emailAddress`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `commentId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `countryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `entrepreneurs`
--
ALTER TABLE `entrepreneurs`
  MODIFY `entrepreneurId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `saferpaylog`
--
ALTER TABLE `saferpaylog`
  MODIFY `logId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `teammembers`
--
ALTER TABLE `teammembers`
  MODIFY `teamMemberId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `teamId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `commentAuthorId` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `commentEntrepreneurId` FOREIGN KEY (`entrepreneurId`) REFERENCES `entrepreneurs` (`entrepreneurId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `commentParentId` FOREIGN KEY (`parentCommentId`) REFERENCES `comments` (`commentId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `entrepreneurs`
--
ALTER TABLE `entrepreneurs`
  ADD CONSTRAINT `entrepreneurCountryId` FOREIGN KEY (`countryId`) REFERENCES `countries` (`countryId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `entrepreneurTeamId` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orderEntrepreneurId` FOREIGN KEY (`entrepreneurId`) REFERENCES `entrepreneurs` (`entrepreneurId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `orderUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `saferpaylog`
--
ALTER TABLE `saferpaylog`
  ADD CONSTRAINT `saferPayOrderId` FOREIGN KEY (`orderId`) REFERENCES `orders` (`orderId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `teammembers`
--
ALTER TABLE `teammembers`
  ADD CONSTRAINT `teamMemberTeamId` FOREIGN KEY (`teamId`) REFERENCES `teams` (`teamId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `teamMemberUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teamLeaderId` FOREIGN KEY (`teamLeaderId`) REFERENCES `teammembers` (`teamMemberId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
