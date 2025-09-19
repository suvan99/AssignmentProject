DROP TABLE IF EXISTS `ratings`;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_store` (`user_id`,`store_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `ratings` VALUES 
(128,9,13,5),
(129,9,14,3),
(130,9,15,4);

DROP TABLE IF EXISTS `stores`;
CREATE TABLE `stores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `stores` VALUES 
(13,'abc','pune'),
(14,'dmart','surat'),
(15,'vadapav center','mumbai');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(400) DEFAULT NULL,
  `role` enum('admin','user','owner') DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` VALUES 
(3,'Elizabeth Catherine Montgomery Anderson','elizabeth@example.com','$2a$10$eA9W2T.yC5t68mbFOh6Cce6YOslMuE47qWZpphvGXvJu0NT8fyDwy','89 Park Lane, Sample City','user'),
(4,'Jonathan Williams Senior','jonathan@example.com','$2b$10$Plomt2dxTM66nMzbxHxQr.xR/WWAbto6MwmFQ8TL3DcMaQNvPl34O','45 User Road, Sample City','user'),
(6,'Administrator John Williams Senior','admin@example.com','$2b$10$wZCQRWbVci2ffg8AJ/4TNesa.zqZs3VWoeZC4WZjLfWGjvGvQkWYy','123 Admin Street','admin'),
(7,'Robert Downey Senior','rdj@example.com','$2b$10$.FW2QINni018O14Qin42vux0Cekgsj.TFSfhHiM/0JbDimoRYtNNK','45 User Road, Sample City','user'),
(8,'shah kashish yogeshbhai','kashish@1234','$2b$10$vfjJ8gAw2kPyIRMZhFo14esrVo7/kin4yudUf0Fy2Cx5mN5SOVlCe','pune','user'),
(9,'shah kashish yogeshbhai','shah@gmail.com','$2b$10$vsuhbaNaaEWbiYcpZq5RqeCCr5BUFxCIKx0q.d23Ubu6NEeaIgRxK','pune','user'),
(10,'matariya dhruv rajeshbhai','matariya@gmail.com','$2b$10$qgZvmyvFKvV/9dwx4IoTleEbX1GuygX3H3IwQAC/pbESh4xEZDCKe','pune','admin');
