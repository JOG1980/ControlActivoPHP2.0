-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2020 at 09:53 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gmocontrolactivo`
--

-- --------------------------------------------------------

--
-- Table structure for table `a_acceso`
--

CREATE TABLE `a_acceso` (
  `acceso_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `acceso_ip` tinyint(1) NOT NULL DEFAULT 0,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(2000) DEFAULT NULL,
  `registro_editable` tinyint(1) NOT NULL DEFAULT 1,
  `ayuda` tinyint(1) NOT NULL DEFAULT 1,
  `rol_id` int(11) DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Datos de acceso (login). lista de usuarios';

--
-- Dumping data for table `a_acceso`
--

INSERT INTO `a_acceso` (`acceso_id`, `username`, `password`, `ip`, `acceso_ip`, `nombre`, `descripcion`, `registro_editable`, `ayuda`, `rol_id`) VALUES
(1, 'admin', 'admin*', NULL, 0, 'Administrador', 'Administrador del sistema', 0, 1, 1),
(2, 'superusuario', 'superusuario*', NULL, 0, 'Super Usuario', 'Super usuario del sistema', 0, 1, 2),
(3, 'usuario', 'usuario*', NULL, 0, 'Usuario', 'Usuario del sistema', 0, 0, 3),
(4, 'invitado', 'invitado*', '', 0, 'invitado', 'Invitado al sistema', 0, 1, 4),
(5, 'jorge.ortiz', '9dyap', '::1', 0, 'Jorge Ortiz Garcia', 'Programador del sistema', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `a_activo`
--

CREATE TABLE `a_activo` (
  `activo_id` int(11) NOT NULL,
  `descipcion` varchar(200) NOT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `numero_serie` varchar(100) DEFAULT NULL,
  `numero_activo` varchar(100) DEFAULT NULL,
  `numero_inventario` varchar(100) DEFAULT NULL,
  `en_uso` tinyint(1) NOT NULL DEFAULT 1,
  `en_activo_oficial` tinyint(1) NOT NULL DEFAULT 0,
  `en_prestamo` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_registro` date NOT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `fecha_alta_activo` date DEFAULT NULL,
  `fecha_baja_activo` date DEFAULT NULL,
  `tipo_activo_id` int(11) NOT NULL,
  `centro_trabajo_id` int(11) NOT NULL,
  `centro_trabajo_id_prestado` int(11) DEFAULT NULL,
  `usuario_id` int(11) NOT NULL,
  `ubicacion_id` int(11) NOT NULL,
  `estado_registro_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tabla donde se concentran todo el equipamiento';

--
-- Dumping data for table `a_activo`
--

INSERT INTO `a_activo` (`activo_id`, `descipcion`, `marca`, `modelo`, `numero_serie`, `numero_activo`, `numero_inventario`, `en_uso`, `en_activo_oficial`, `en_prestamo`, `fecha_registro`, `fecha_ingreso`, `fecha_alta_activo`, `fecha_baja_activo`, `tipo_activo_id`, `centro_trabajo_id`, `centro_trabajo_id_prestado`, `usuario_id`, `ubicacion_id`, `estado_registro_id`) VALUES
(1, 'Acer Predator 15', 'Acer', 'Predator 15', 'xxx', 'yyyy', 'zzz', 1, 0, 0, '2020-04-15', NULL, NULL, NULL, 1, 1, NULL, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `a_observaciones_activo`
--

CREATE TABLE `a_observaciones_activo` (
  `observaciones_id` int(11) NOT NULL,
  `texto` varchar(2000) NOT NULL,
  `activo_id` int(11) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tabla de Observaciones';

--
-- Dumping data for table `a_observaciones_activo`
--

INSERT INTO `a_observaciones_activo` (`observaciones_id`, `texto`, `activo_id`, `fecha`) VALUES
(1, 'Equipo personal (registro de prueba)', 1, '2020-04-15');

-- --------------------------------------------------------

--
-- Table structure for table `c_centro_trabajo`
--

CREATE TABLE `c_centro_trabajo` (
  `centro_trabajo_id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL,
  `estado_registro_id` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Centro de trabajo donde se encuenta el activo';

--
-- Dumping data for table `c_centro_trabajo`
--

INSERT INTO `c_centro_trabajo` (`centro_trabajo_id`, `nombre`, `descripcion`, `fecha_registro`, `estado_registro_id`) VALUES
(1, 'Zona de Operación de Transmision Guerrero Morelos (ZOTGM)', 'Zona de Operacion perteneciente a la GRTC', '2020-05-29 11:46:52', 2),
(2, 'Zona de Transmisión Guerrero (ZTG) ', 'Zona perteneciente a la GRTC', '2020-05-20 19:48:01', 2),
(144, 'Prueba', 'registro de prueba', '2020-06-04 13:56:49', 3);

-- --------------------------------------------------------

--
-- Table structure for table `c_estado_registro`
--

CREATE TABLE `c_estado_registro` (
  `estado_registro_id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Estado de los registros';

--
-- Dumping data for table `c_estado_registro`
--

INSERT INTO `c_estado_registro` (`estado_registro_id`, `nombre`, `descripcion`, `fecha_registro`) VALUES
(1, 'Normal', 'Registro en condiciones normales', '2020-04-20 12:00:00'),
(2, 'Pendiente', 'Registro en estado pendiente: inconcluso, etc. ', '2020-04-20 12:00:00'),
(3, 'Revisión', 'Registro que requiere revisión', '2020-04-20 12:00:00'),
(4, 'Duplicado', 'Registro duplicado en condiciones normales', '2020-05-02 09:57:00'),
(5, 'Duplicado en Cascada', 'Registro duplicado en cascada. Normalmente requiere revisión)', '2020-05-21 21:05:00');

-- --------------------------------------------------------

--
-- Table structure for table `c_grupo`
--

CREATE TABLE `c_grupo` (
  `grupo_id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL,
  `estado_registro_id` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Grupos definidos para el equipamiento';

--
-- Dumping data for table `c_grupo`
--

INSERT INTO `c_grupo` (`grupo_id`, `nombre`, `descripcion`, `fecha_registro`, `estado_registro_id`) VALUES
(1, 'Equipo Corporativo', NULL, '2020-04-01 00:00:00', 1),
(2, 'SCADA', 'Sistemas de adquisicion de datos SCADA', '2020-04-01 00:00:01', 1),
(3, 'test', 'test descripcion', '2020-06-05 11:00:09', 3);

-- --------------------------------------------------------

--
-- Table structure for table `c_rol`
--

CREATE TABLE `c_rol` (
  `rol_id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Roles de acceso al sistema';

--
-- Dumping data for table `c_rol`
--

INSERT INTO `c_rol` (`rol_id`, `nombre`, `descripcion`) VALUES
(1, 'Admin', 'Acceso total al sistema. Acceso a todas las funciones: altas, bajas consultas y modificaciones. Creacion de usuarios y configuraciones'),
(2, 'Super Usuario', 'Acceso a todas las funciones: altas, bajas consultas y modificaciones en el activo y los catálogos.'),
(3, 'Usuario', 'Acceso a todas las funciones: altas, bajas consultas y modificaciones solo en en el activo.'),
(4, 'Invitado', 'Solo funciones de consulta.');

-- --------------------------------------------------------

--
-- Table structure for table `c_subgrupo`
--

CREATE TABLE `c_subgrupo` (
  `subgrupo_id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL,
  `grupo_id` int(11) NOT NULL,
  `estado_registro_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Subgrupo de los activos';

--
-- Dumping data for table `c_subgrupo`
--

INSERT INTO `c_subgrupo` (`subgrupo_id`, `nombre`, `descripcion`, `fecha_registro`, `grupo_id`, `estado_registro_id`) VALUES
(1, 'Laptops Corporativas', '', '2020-04-07 07:07:07', 1, 1),
(2, 'Desktops Corporativas', NULL, '2020-04-08 14:59:59', 1, 1),
(3, 'Equipo Corporativo que requiere baja', '', '2020-04-09 04:30:00', 1, 1),
(4, 'Consolas SCADA', 'PC que ocupan los operadores', '2020-04-10 22:22:22', 2, 1),
(5, 'PC Scada', 'PC que ocupan los supervisores y profesionistas', '2020-04-11 23:00:34', 2, 1),
(6, 'Servidores SCADA', NULL, '2020-04-18 00:18:00', 2, 1),
(7, 'Equipo de comunicaciones SCADA', NULL, '2020-04-20 00:00:00', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `c_tipo_activo`
--

CREATE TABLE `c_tipo_activo` (
  `tipo_activo_id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL,
  `estado_registro_id` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Definicion d elos tipos de activo';

--
-- Dumping data for table `c_tipo_activo`
--

INSERT INTO `c_tipo_activo` (`tipo_activo_id`, `nombre`, `descripcion`, `fecha_registro`, `estado_registro_id`) VALUES
(1, 'Laptop', 'Equipo portatil', '2020-06-02 20:53:20', 1),
(1134, 'Aire acondicionado', 'Equipo de aire acondicionado', '2020-05-25 21:12:36', 1),
(1376, 'test', 'rtrttrtr', '2020-06-01 15:29:47', 1),
(1377, 'dfddf', '', '2020-06-01 15:29:52', 1),
(1378, 'test (2020-06-01 15:29:55.177)', 'rtrttrtr', '2020-06-01 15:29:55', 5),
(1379, 'dfddf (2020-06-02 19:17:11.83)', 'd', '2020-06-02 19:25:00', 5),
(1380, 'Aire acondicionado (2020-06-02 19:37:07.817)', 'Equipo de aire acondicionado', '2020-06-02 19:37:07', 5),
(1381, 'dfddf (2020-06-02 19:37:09.591)', '', '2020-06-02 19:37:09', 5),
(1382, 'dfdf', 'dffd', '2020-06-02 19:57:32', 1);

-- --------------------------------------------------------

--
-- Table structure for table `c_ubicacion`
--

CREATE TABLE `c_ubicacion` (
  `ubicacion_id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` varchar(1000) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL,
  `estado_registro_id` int(11) NOT NULL DEFAULT 1,
  `centro_trabajo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Definicion de ubicaciones fisicas en el centro de trabajo';

--
-- Dumping data for table `c_ubicacion`
--

INSERT INTO `c_ubicacion` (`ubicacion_id`, `nombre`, `descripcion`, `fecha_registro`, `estado_registro_id`, `centro_trabajo_id`) VALUES
(1, 'Oficina de Programación y Equipos', 'Oficina de programación', '2020-05-06 14:00:00', 1, 1),
(2, 'Oficina de Aplicaciones de Potencia', 'Oficina de aplicaciones de tiempo real', '2020-05-06 14:00:00', 1, 1),
(3, 'Oficina de la Supervision de PyE', 'Oficina del supervisor de Programación y Equipos', '2020-05-06 14:00:00', 1, 1),
(4, 'Oficina de la Supervision de Operación', 'Oficina del Supervisor de Operacion en la sala de operacion', '2020-05-06 14:00:00', 1, 1),
(5, 'Sala de Operación', 'Sala principal del departamento de Operación', '2020-05-06 14:00:00', 1, 1),
(20, 'casa', 'mi casa', '2020-06-03 20:39:11', 1, 2),
(23, 'Oficina de Programación y Equipos (2020-06-03 21:07:23.941)', 'Oficina de programación', '2020-06-03 21:07:23', 5, 1),
(24, 'casa (2020-06-03 21:08:01.256)', 'mi casa', '2020-06-03 21:08:01', 5, 2);

-- --------------------------------------------------------

--
-- Table structure for table `c_usuario`
--

CREATE TABLE `c_usuario` (
  `usuario_id` int(11) NOT NULL,
  `nombres` varchar(100) NOT NULL,
  `apellido_paterno` varchar(100) NOT NULL,
  `apellido_materno` varchar(100) DEFAULT NULL,
  `rpe` varchar(5) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `habilitado` tinyint(1) DEFAULT 1,
  `fecha_registro` datetime NOT NULL,
  `estado_registro_id` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Lista de usuarios del equipamiento';

--
-- Dumping data for table `c_usuario`
--

INSERT INTO `c_usuario` (`usuario_id`, `nombres`, `apellido_paterno`, `apellido_materno`, `rpe`, `email`, `habilitado`, `fecha_registro`, `estado_registro_id`) VALUES
(1, 'Jorge', 'Ortiz', 'García', '9DYAP', 'jorge.ortiz09@cfe.gob.mx', 1, '2020-05-24 14:49:36', 1),
(2, 'Eduardo', 'Viveros', 'Capote', '9DY88', NULL, 1, '2020-04-07 12:30:15', 1),
(3, 'Alejandro', 'Mendoza', 'Viveros', '9DY8K', NULL, 1, '2020-05-15 22:50:45', 1),
(4, 'Melissa', 'Ríos', 'Juarez', '9DYBA', 'melissa.rios@cfe.gob.mx', 1, '2020-05-19 23:29:31', 3),
(5, 'Carolina', 'Castillo', 'Salado', '9DY87', 'carolina.castillo@cfe.gob.mx', 0, '2020-05-18 13:42:45', 3),
(6, 'Andres', 'Morales', 'León', '9DY8L', 'andres.morales@cfe.gob.mx', 1, '2020-05-19 23:25:57', 1),
(7, 'Oscar Francisco', 'Herrera', 'Lorenzo', '9DYB0', 'oscar.herrera@cfe.gob.mx', 0, '2020-05-18 13:44:50', 4),
(8, 'Salvador', 'Navarrete', 'Hernández', '9DYA0', 'salvador.navarrete@cfe.gob.mx', 0, '2020-05-18 13:45:01', 4),
(9, 'José Natividad', 'Silva', 'Genchi', '9DYBB', 'jose.silva@cfe.gob.mx', 1, '2020-05-18 13:46:23', 1),
(10, 'Jessica', 'Rodríguez', 'Zavaleta', 'I0666', 'jessica.rodriguez@cfe.gob.mx', 0, '2020-05-18 13:47:45', 2);

-- --------------------------------------------------------

--
-- Table structure for table `r_grupo_activo`
--

CREATE TABLE `r_grupo_activo` (
  `grupo_activo_id` int(11) NOT NULL,
  `grupo_id` int(11) NOT NULL,
  `activo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Tabla relacional de grupos';

--
-- Dumping data for table `r_grupo_activo`
--

INSERT INTO `r_grupo_activo` (`grupo_activo_id`, `grupo_id`, `activo_id`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `r_subgrupo_activo`
--

CREATE TABLE `r_subgrupo_activo` (
  `subgrupo_activo_id` int(11) NOT NULL,
  `subgrupo_id` int(11) NOT NULL,
  `activo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `a_acceso`
--
ALTER TABLE `a_acceso`
  ADD PRIMARY KEY (`acceso_id`),
  ADD UNIQUE KEY `a_acceso_un` (`username`),
  ADD KEY `acceso_fk` (`rol_id`);

--
-- Indexes for table `a_activo`
--
ALTER TABLE `a_activo`
  ADD PRIMARY KEY (`activo_id`),
  ADD KEY `activo_fk_usuario` (`usuario_id`),
  ADD KEY `activo_fk_ubicacion` (`ubicacion_id`),
  ADD KEY `activo_fk_estado_registro` (`estado_registro_id`),
  ADD KEY `activo_fk_tipo_activo` (`tipo_activo_id`),
  ADD KEY `activo_fk_centro_trabajo` (`centro_trabajo_id`),
  ADD KEY `activo_fk_centro_trabajo_prestado` (`centro_trabajo_id_prestado`);

--
-- Indexes for table `a_observaciones_activo`
--
ALTER TABLE `a_observaciones_activo`
  ADD PRIMARY KEY (`observaciones_id`),
  ADD KEY `a_observaciones_activo_fk` (`activo_id`);

--
-- Indexes for table `c_centro_trabajo`
--
ALTER TABLE `c_centro_trabajo`
  ADD PRIMARY KEY (`centro_trabajo_id`),
  ADD UNIQUE KEY `c_centro_trabajo_un` (`nombre`),
  ADD KEY `c_centro_trabajo_fk` (`estado_registro_id`);

--
-- Indexes for table `c_estado_registro`
--
ALTER TABLE `c_estado_registro`
  ADD PRIMARY KEY (`estado_registro_id`),
  ADD UNIQUE KEY `c_estado_registro_un` (`nombre`);

--
-- Indexes for table `c_grupo`
--
ALTER TABLE `c_grupo`
  ADD PRIMARY KEY (`grupo_id`),
  ADD UNIQUE KEY `c_grupo_un` (`nombre`),
  ADD KEY `c_grupo_fk` (`estado_registro_id`);

--
-- Indexes for table `c_rol`
--
ALTER TABLE `c_rol`
  ADD PRIMARY KEY (`rol_id`);

--
-- Indexes for table `c_subgrupo`
--
ALTER TABLE `c_subgrupo`
  ADD PRIMARY KEY (`subgrupo_id`),
  ADD UNIQUE KEY `c_subgrupo_un` (`nombre`),
  ADD KEY `c_subgrupo_fk` (`grupo_id`),
  ADD KEY `c_subgrupo_fk_1` (`estado_registro_id`);

--
-- Indexes for table `c_tipo_activo`
--
ALTER TABLE `c_tipo_activo`
  ADD PRIMARY KEY (`tipo_activo_id`),
  ADD UNIQUE KEY `c_tipo_activo_un` (`nombre`),
  ADD KEY `c_tipo_activo_fk` (`estado_registro_id`);

--
-- Indexes for table `c_ubicacion`
--
ALTER TABLE `c_ubicacion`
  ADD PRIMARY KEY (`ubicacion_id`),
  ADD UNIQUE KEY `c_ubicacion_un` (`nombre`),
  ADD KEY `c_ubicacion_fk` (`estado_registro_id`),
  ADD KEY `c_ubicacion_fk_1` (`centro_trabajo_id`);

--
-- Indexes for table `c_usuario`
--
ALTER TABLE `c_usuario`
  ADD PRIMARY KEY (`usuario_id`),
  ADD UNIQUE KEY `c_usuario_un` (`nombres`,`apellido_paterno`,`rpe`),
  ADD KEY `c_usuario_fk` (`estado_registro_id`);

--
-- Indexes for table `r_grupo_activo`
--
ALTER TABLE `r_grupo_activo`
  ADD PRIMARY KEY (`grupo_activo_id`),
  ADD KEY `r_grupo_activo_fk_activo` (`activo_id`),
  ADD KEY `r_grupo_activo_fk_grupo` (`grupo_id`);

--
-- Indexes for table `r_subgrupo_activo`
--
ALTER TABLE `r_subgrupo_activo`
  ADD PRIMARY KEY (`subgrupo_activo_id`),
  ADD KEY `r_subgrupo_activo_fk` (`activo_id`),
  ADD KEY `r_subgrupo_activo_fk_1` (`subgrupo_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `a_acceso`
--
ALTER TABLE `a_acceso`
  MODIFY `acceso_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `a_activo`
--
ALTER TABLE `a_activo`
  MODIFY `activo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `a_observaciones_activo`
--
ALTER TABLE `a_observaciones_activo`
  MODIFY `observaciones_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `c_centro_trabajo`
--
ALTER TABLE `c_centro_trabajo`
  MODIFY `centro_trabajo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT for table `c_estado_registro`
--
ALTER TABLE `c_estado_registro`
  MODIFY `estado_registro_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `c_grupo`
--
ALTER TABLE `c_grupo`
  MODIFY `grupo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `c_rol`
--
ALTER TABLE `c_rol`
  MODIFY `rol_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `c_subgrupo`
--
ALTER TABLE `c_subgrupo`
  MODIFY `subgrupo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `c_tipo_activo`
--
ALTER TABLE `c_tipo_activo`
  MODIFY `tipo_activo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1383;

--
-- AUTO_INCREMENT for table `c_ubicacion`
--
ALTER TABLE `c_ubicacion`
  MODIFY `ubicacion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `c_usuario`
--
ALTER TABLE `c_usuario`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=177;

--
-- AUTO_INCREMENT for table `r_grupo_activo`
--
ALTER TABLE `r_grupo_activo`
  MODIFY `grupo_activo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `r_subgrupo_activo`
--
ALTER TABLE `r_subgrupo_activo`
  MODIFY `subgrupo_activo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `a_acceso`
--
ALTER TABLE `a_acceso`
  ADD CONSTRAINT `acceso_fk` FOREIGN KEY (`rol_id`) REFERENCES `c_rol` (`rol_id`);

--
-- Constraints for table `a_activo`
--
ALTER TABLE `a_activo`
  ADD CONSTRAINT `activo_fk_centro_trabajo` FOREIGN KEY (`centro_trabajo_id`) REFERENCES `c_centro_trabajo` (`centro_trabajo_id`),
  ADD CONSTRAINT `activo_fk_centro_trabajo_prestado` FOREIGN KEY (`centro_trabajo_id_prestado`) REFERENCES `c_centro_trabajo` (`centro_trabajo_id`),
  ADD CONSTRAINT `activo_fk_estado_registro` FOREIGN KEY (`estado_registro_id`) REFERENCES `c_estado_registro` (`estado_registro_id`),
  ADD CONSTRAINT `activo_fk_tipo_activo` FOREIGN KEY (`tipo_activo_id`) REFERENCES `c_tipo_activo` (`tipo_activo_id`),
  ADD CONSTRAINT `activo_fk_ubicacion` FOREIGN KEY (`ubicacion_id`) REFERENCES `c_ubicacion` (`ubicacion_id`),
  ADD CONSTRAINT `activo_fk_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `c_usuario` (`usuario_id`);

--
-- Constraints for table `a_observaciones_activo`
--
ALTER TABLE `a_observaciones_activo`
  ADD CONSTRAINT `a_observaciones_activo_fk` FOREIGN KEY (`activo_id`) REFERENCES `a_activo` (`activo_id`);

--
-- Constraints for table `c_centro_trabajo`
--
ALTER TABLE `c_centro_trabajo`
  ADD CONSTRAINT `c_centro_trabajo_fk` FOREIGN KEY (`estado_registro_id`) REFERENCES `c_estado_registro` (`estado_registro_id`);

--
-- Constraints for table `c_grupo`
--
ALTER TABLE `c_grupo`
  ADD CONSTRAINT `c_grupo_fk` FOREIGN KEY (`estado_registro_id`) REFERENCES `c_estado_registro` (`estado_registro_id`);

--
-- Constraints for table `c_subgrupo`
--
ALTER TABLE `c_subgrupo`
  ADD CONSTRAINT `c_subgrupo_fk` FOREIGN KEY (`grupo_id`) REFERENCES `c_grupo` (`grupo_id`),
  ADD CONSTRAINT `c_subgrupo_fk_1` FOREIGN KEY (`estado_registro_id`) REFERENCES `c_estado_registro` (`estado_registro_id`);

--
-- Constraints for table `c_tipo_activo`
--
ALTER TABLE `c_tipo_activo`
  ADD CONSTRAINT `c_tipo_activo_fk` FOREIGN KEY (`estado_registro_id`) REFERENCES `c_estado_registro` (`estado_registro_id`);

--
-- Constraints for table `c_ubicacion`
--
ALTER TABLE `c_ubicacion`
  ADD CONSTRAINT `c_ubicacion_fk` FOREIGN KEY (`estado_registro_id`) REFERENCES `c_estado_registro` (`estado_registro_id`),
  ADD CONSTRAINT `c_ubicacion_fk_1` FOREIGN KEY (`centro_trabajo_id`) REFERENCES `c_centro_trabajo` (`centro_trabajo_id`);

--
-- Constraints for table `c_usuario`
--
ALTER TABLE `c_usuario`
  ADD CONSTRAINT `c_usuario_fk` FOREIGN KEY (`estado_registro_id`) REFERENCES `c_estado_registro` (`estado_registro_id`);

--
-- Constraints for table `r_grupo_activo`
--
ALTER TABLE `r_grupo_activo`
  ADD CONSTRAINT `r_grupo_activo_fk_activo` FOREIGN KEY (`activo_id`) REFERENCES `a_activo` (`activo_id`),
  ADD CONSTRAINT `r_grupo_activo_fk_grupo` FOREIGN KEY (`grupo_id`) REFERENCES `c_grupo` (`grupo_id`);

--
-- Constraints for table `r_subgrupo_activo`
--
ALTER TABLE `r_subgrupo_activo`
  ADD CONSTRAINT `r_subgrupo_activo_fk` FOREIGN KEY (`activo_id`) REFERENCES `a_activo` (`activo_id`),
  ADD CONSTRAINT `r_subgrupo_activo_fk_1` FOREIGN KEY (`subgrupo_id`) REFERENCES `c_subgrupo` (`subgrupo_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
