-- ============================================================
-- Servicio de Identidad (SQL Server)
-- Dueño exclusivo de: usuario, rol, permiso, autenticación, login
-- Sin Foreign Keys hacia otros motores (MySQL/PostgreSQL/MongoDB)
-- ============================================================

CREATE DATABASE ApuestasIdentidad;
GO
USE ApuestasIdentidad;
GO

CREATE TABLE Rol (
    id_rol        INT IDENTITY(1,1) PRIMARY KEY,
    nombre_rol    VARCHAR(50) NOT NULL UNIQUE,
    nivel_acceso  INT NOT NULL DEFAULT 1,
    descripcion   VARCHAR(200)
);

CREATE TABLE Permiso (
    id_permiso      INT IDENTITY(1,1) PRIMARY KEY,
    nombre_permiso  VARCHAR(60) NOT NULL UNIQUE,
    modulo          VARCHAR(40),
    descripcion     VARCHAR(200)
);

CREATE TABLE RolPermiso (
    id_rol     INT NOT NULL,
    id_permiso INT NOT NULL,
    PRIMARY KEY (id_rol, id_permiso),
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol),
    FOREIGN KEY (id_permiso) REFERENCES Permiso(id_permiso)
);

CREATE TABLE EstadoUsuario (
    id_estado      INT IDENTITY(1,1) PRIMARY KEY,
    nombre         VARCHAR(30) NOT NULL UNIQUE,
    permite_login  BIT NOT NULL DEFAULT 1
);

CREATE TABLE Usuario (
    id_usuario       INT IDENTITY(1,1) PRIMARY KEY,
    correo           VARCHAR(120) NOT NULL UNIQUE,
    nombre           VARCHAR(60) NOT NULL,
    apellido         VARCHAR(60) NOT NULL,
    contrasena_hash  VARCHAR(255) NOT NULL,
    id_rol           INT NOT NULL,
    id_estado        INT NOT NULL,
    fecha_creacion   DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol),
    FOREIGN KEY (id_estado) REFERENCES EstadoUsuario(id_estado)
);

CREATE TABLE Login (
    id_login    INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario  INT NOT NULL,
    fecha_hora  DATETIME NOT NULL DEFAULT GETDATE(),
    ip_origen   VARCHAR(45),
    resultado   VARCHAR(10) NOT NULL CHECK (resultado IN ('Exitoso','Fallido')),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);
GO

-- ============================================================
-- Datos semilla
-- ============================================================
INSERT INTO EstadoUsuario (nombre, permite_login) VALUES
('Activo', 1), ('Inactivo', 0), ('Bloqueado', 0);

INSERT INTO Rol (nombre_rol, nivel_acceso, descripcion) VALUES
('Cliente', 1, 'Usuario que apuesta'),
('Soporte', 2, 'Atiende clientes y consulta reportes'),
('Operador', 2, 'Gestiona apuestas y transacciones'),
('Editor', 2, 'Edita partidos y cuotas'),
('Administrador', 4, 'Acceso total al sistema');

INSERT INTO Permiso (nombre_permiso, modulo, descripcion) VALUES
('Gestionar usuarios', 'Seguridad', 'Crear, editar o desactivar usuarios'),
('Editar partidos', 'Deportes', 'Crear y modificar partidos y cuotas'),
('Gestionar apuestas', 'Apuestas', 'Aprobar, liquidar o cancelar apuestas'),
('Ver reportes', 'Reportes', 'Consultar reportes del sistema');

-- Contraseña de prueba para los 2 usuarios: "123456" (bcrypt, 10 rondas)
-- Reemplaza el hash real generado por tu API al registrar usuarios de verdad.
INSERT INTO Usuario (correo, nombre, apellido, contrasena_hash, id_rol, id_estado) VALUES
('admin@betcolombia.com', 'Carlos', 'Mora',
 '$2b$10$CwTycUXWue0Thq9StjUM0uJ8m4ad.8ZK9Kg5uNfHe1F/A02C6e5S.', 5, 1),
('juan.perez@mail.com', 'Juan', 'Pérez',
 '$2b$10$CwTycUXWue0Thq9StjUM0uJ8m4ad.8ZK9Kg5uNfHe1F/A02C6e5S.', 1, 1);
GO
