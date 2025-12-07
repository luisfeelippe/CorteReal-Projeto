-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 07-Dez-2025 às 20:02
-- Versão do servidor: 10.1.38-MariaDB
-- versão do PHP: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cortereal`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `address` text,
  `payment_method` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total`, `status`, `created_at`, `address`, `payment_method`) VALUES
(24, 6, '1619.10', 'Entregue', '2025-11-30 15:21:34', 'R. São José, 95 - Mombaça/CE', 'pix'),
(25, 6, '2999.00', 'Entregue', '2025-11-30 15:22:06', 'R. São José, 95 - Mombaça/CE', 'pix'),
(26, 7, '1241.40', 'Pendente', '2025-11-30 15:28:11', 'R. São José, 95 - Mombaça/CE', 'credit'),
(27, 7, '1325.70', 'Pendente', '2025-11-30 15:28:36', 'R. São José, 95 - Mombaça/CE', 'pix'),
(28, 8, '179.70', 'Entregue', '2025-11-30 20:03:37', 'Sao Jose, 95 - Mombaça/CE', 'pix'),
(29, 8, '1679.20', 'Enviado', '2025-11-30 20:04:37', 'Sao Jose, 95 - Mombaça/CE', 'credit'),
(30, 8, '59.90', 'Pendente', '2025-11-30 20:05:15', 'Sao Jose, 95 - Mombaça/CE', 'pix'),
(31, 9, '2407.20', 'Enviado', '2025-11-30 21:59:50', 'R. São José, 95 - Mombaça/CE', 'pix'),
(32, 9, '441.90', 'Entregue', '2025-11-30 22:00:21', 'R. São José, 95 - Mombaça/CE', 'pix'),
(33, 10, '959.40', 'Entregue', '2025-12-01 23:50:44', 'R. São José, 95 - Mombaça/CE', 'pix'),
(34, 10, '10939.40', 'Enviado', '2025-12-01 23:52:04', ',  - /', 'credit'),
(35, 11, '3599.20', 'Entregue', '2025-12-03 00:03:04', 'Rua 5, Centro, 10 - Mombaça/CE', 'pix'),
(36, 11, '600.87', 'Pendente', '2025-12-03 00:22:30', 'Rua 5, Centro, 10 - Mombaça/CE', 'credit'),
(37, 12, '6598.20', 'Enviado', '2025-12-04 16:28:59', 'Rua 5, Centro, 10 - Mombaça/CE', 'pix'),
(38, 12, '899.80', 'Entregue', '2025-12-04 16:34:01', 'Rua 5, Centro, 10 - Mombaça/CE', 'credit'),
(42, 14, '3599.20', 'Enviado', '2025-12-07 18:15:34', 'Rua 5, Centro, 10 - Mombaça/CE', 'pix'),
(43, 14, '2099.40', 'Entregue', '2025-12-07 18:16:45', 'Rua 5, Centro, 10 - Mombaça/CE', 'credit'),
(44, 14, '2768.70', 'Pendente', '2025-12-07 18:18:18', 'Rua 5, Centro, 10 - Mombaça/CE', 'pix'),
(45, 14, '800.00', 'Pendente', '2025-12-07 18:24:07', 'Rua 5, Centro, 10 - Mombaça/CE', 'pix'),
(46, 14, '200.00', 'Pendente', '2025-12-07 18:24:33', 'Rua 5, Centro, 10 - Mombaça/CE', 'credit'),
(47, 14, '599.00', 'Pendente', '2025-12-07 18:25:09', 'Rua 5, Centro, 10 - Mombaça/CE', 'pix');

-- --------------------------------------------------------

--
-- Estrutura da tabela `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price_at_moment` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price_at_moment`) VALUES
(33, 24, 1, 2, '199.90'),
(34, 24, 2, 2, '449.90'),
(35, 24, 5, 2, '69.90'),
(36, 24, 4, 3, '59.90'),
(37, 25, 3, 10, '299.90'),
(38, 26, 10, 2, '220.95'),
(39, 26, 6, 5, '159.90'),
(40, 27, 10, 6, '220.95'),
(41, 28, 4, 3, '59.90'),
(42, 29, 3, 5, '299.90'),
(43, 29, 4, 3, '59.90'),
(44, 30, 4, 1, '59.90'),
(45, 31, 6, 4, '159.90'),
(46, 31, 10, 8, '220.95'),
(47, 32, 10, 2, '220.95'),
(48, 33, 6, 6, '159.90'),
(49, 34, 11, 42, '255.70'),
(50, 34, 12, 10, '20.00'),
(51, 35, 2, 8, '449.90'),
(52, 36, 13, 3, '200.29'),
(53, 37, 3, 10, '299.90'),
(54, 37, 2, 8, '449.90'),
(55, 38, 2, 2, '449.90'),
(56, 39, 2, 8, '449.90'),
(57, 40, 2, 2, '449.90'),
(58, 40, 3, 6, '299.90'),
(59, 40, 10, 10, '220.95'),
(60, 41, 15, 10, '100.00'),
(61, 42, 2, 8, '449.90'),
(62, 43, 2, 2, '449.90'),
(63, 43, 3, 4, '299.90'),
(64, 44, 10, 10, '220.95'),
(65, 44, 5, 8, '69.90'),
(66, 45, 16, 8, '100.00'),
(67, 46, 16, 2, '100.00'),
(68, 47, 4, 10, '59.90');

-- --------------------------------------------------------

--
-- Estrutura da tabela `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `stock` int(11) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image_url`, `category`, `stock`, `is_active`) VALUES
(1, 'Jaqueta Casual', NULL, '199.90', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop', 'Jaquetas', 80, 1),
(2, 'Relógio Minimal', NULL, '449.90', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop', 'Acessórios', 10, 1),
(3, 'Tênis Urbano', NULL, '299.90', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop', 'Calçados', 0, 0),
(4, 'Boné Street', NULL, '59.90', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop', 'Acessórios', 0, 1),
(5, 'Camiseta Basic', NULL, '69.90', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', 'Camisetas', 0, 1),
(6, 'Blusa Tricot', NULL, '159.90', 'https://storecw.com.br/cdn/shop/files/Camisa_Polo_Italiana_Tricot_Branca.png', 'Inverno', 20, 0),
(10, 'Relógio Curren', NULL, '220.95', 'https://http2.mlstatic.com/D_NQ_NP_2X_723237-MLA95526864214_102025-F.webp', 'Acessórios', 0, 1),
(11, 'Old Money', NULL, '255.70', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-r4aY1gOeD6PbEDx4oyCRgQ4ThiAEYPR13A&s', 'Camisetas', 38, 0),
(12, 'Iphone 17', NULL, '20.00', 'https://platform.theverge.com/wp-content/uploads/sites/2/2025/09/iphone-17-pro-pro-max.webp?quality=90&strip=all&crop=16.666666666667,0,66.666666666667,100', 'Acessórios', 0, 0),
(13, 'Produto Teste', NULL, '200.29', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhwVU4RAByx-pO1K10YRZ3jSiBE9zjxku7VA&s', 'Camisetas', 2, 0),
(14, 'Blusa Seleção Brasileira', NULL, '100.00', 'https://dasports.com.br/cdn/shop/products/camisa-selecao-brasil-comissao-tecnica-nike-preta-5014815.webp?v=1756700672', 'Camisetas', 10, 0),
(15, 'Produto Teste2', NULL, '100.00', '.', 'Camisetas', 0, 0),
(16, 'Blusa do Palmeiras', NULL, '100.00', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdeo37u15yUlS1TKTR3cD3fgfe4_dierL40w&s', 'Camisetas', 0, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `cpf`, `birth_date`, `password`, `is_admin`, `created_at`) VALUES
(5, 'Admin Teste', 'admin@teste1.com', '111.222.333.44', '2000-10-10', '123', 1, '2025-11-30 15:12:20'),
(6, 'Usuario Teste', 'usuario@teste1.com', '111.222.333.44', '2000-10-10', '123', 0, '2025-11-30 15:13:38'),
(7, 'Usuario Teste 2', 'usuario@teste2.com', '111.222.333.55', '2000-10-10', '123', 0, '2025-11-30 15:14:21'),
(8, 'user 3 teste', 'usuario@teste3.com', '12345678912', '2020-12-10', '123', 0, '2025-11-30 20:02:14'),
(9, 'Evilu', 'evilu@marieta.com', '232.332.323-12', '2010-10-10', '123', 0, '2025-11-30 21:58:17'),
(10, 'Rafaelzinho', 'rafael@cv.com', '111.222.333.44', '2000-10-10', '123', 0, '2025-12-01 23:49:26'),
(11, 'Wendel Maciel', 'wendel@teste.com', '123.456.789-10', '2000-10-10', '123', 0, '2025-12-02 23:55:13'),
(12, 'Victor Pinheiro', 'victor@teste.com', '123.456.789-10', '2000-10-10', '123', 0, '2025-12-04 16:23:29'),
(13, 'Wendel Maciel', 'wendel@gmail.com', '123.456.789-10', '2000-10-10', '123', 0, '2025-12-07 17:46:11'),
(14, 'Wendel Maciel', 'wendelmaciel@gmail.com', '123.456.789-10', '2000-10-10', '123', 0, '2025-12-07 18:14:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Limitadores para a tabela `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
