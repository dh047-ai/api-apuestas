-- ============================================================
-- Servicio de Deportes (MySQL)
-- Dueño exclusivo de: ligas, equipos, partidos, jornadas
-- Sin Foreign Keys hacia otros motores (SQLServer/PostgreSQL/MongoDB)
-- ============================================================

CREATE DATABASE IF NOT EXISTS apuestas_deportes
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE apuestas_deportes;

CREATE TABLE Liga (
    id_liga      INT AUTO_INCREMENT PRIMARY KEY,
    nombre_liga  VARCHAR(80) NOT NULL UNIQUE,
    categoria    VARCHAR(40),
    descripcion  VARCHAR(200)
);

CREATE TABLE Estadio (
    id_estadio      INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estadio  VARCHAR(100) NOT NULL UNIQUE,
    ciudad          VARCHAR(80) NOT NULL,
    capacidad       INT
);

CREATE TABLE Equipo (
    id_equipo      INT AUTO_INCREMENT PRIMARY KEY,
    nombre_equipo  VARCHAR(80) NOT NULL UNIQUE,
    ciudad         VARCHAR(80) NOT NULL,
    id_estadio     INT,
    escudo_url     VARCHAR(255),
    FOREIGN KEY (id_estadio) REFERENCES Estadio(id_estadio)
);

CREATE TABLE EquipoLiga (
    id_equipo  INT NOT NULL,
    id_liga    INT NOT NULL,
    anio       SMALLINT NOT NULL,
    PRIMARY KEY (id_equipo, id_liga, anio),
    FOREIGN KEY (id_equipo) REFERENCES Equipo(id_equipo),
    FOREIGN KEY (id_liga) REFERENCES Liga(id_liga)
);

CREATE TABLE Jornada (
    id_jornada      INT AUTO_INCREMENT PRIMARY KEY,
    id_liga         INT NOT NULL,
    anio            SMALLINT NOT NULL,
    numero_jornada  INT NOT NULL,
    fecha_inicio    DATE,
    fecha_fin       DATE,
    UNIQUE (id_liga, anio, numero_jornada),
    FOREIGN KEY (id_liga) REFERENCES Liga(id_liga)
);

CREATE TABLE EstadoPartido (
    id_estado       INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(30) NOT NULL UNIQUE,
    partido_activo  TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE Partido (
    id_partido            INT AUTO_INCREMENT PRIMARY KEY,
    id_jornada            INT NOT NULL,
    id_equipo_local       INT NOT NULL,
    id_equipo_visitante   INT NOT NULL,
    id_estadio            INT NOT NULL,
    fecha_hora             DATETIME NOT NULL,
    id_estado             INT NOT NULL,
    marcador_local        INT DEFAULT NULL,
    marcador_visitante    INT DEFAULT NULL,
    FOREIGN KEY (id_jornada) REFERENCES Jornada(id_jornada),
    FOREIGN KEY (id_equipo_local) REFERENCES Equipo(id_equipo),
    FOREIGN KEY (id_equipo_visitante) REFERENCES Equipo(id_equipo),
    FOREIGN KEY (id_estadio) REFERENCES Estadio(id_estadio),
    FOREIGN KEY (id_estado) REFERENCES EstadoPartido(id_estado)
);

-- ============================================================
-- Datos semilla
-- ============================================================
INSERT INTO Liga (nombre_liga, categoria, descripcion) VALUES
('Liga BetPlay', 'Primera A', 'Torneo profesional de primera división de Colombia'),
('Copa Colombia', 'Copa', 'Torneo de copa nacional');

INSERT INTO Estadio (nombre_estadio, ciudad, capacidad) VALUES
('Estadio El Campín', 'Bogotá', 36343),
('Estadio Atanasio Girardot', 'Medellín', 44739),
('Estadio Metropolitano Roberto Meléndez', 'Barranquilla', 46692);

INSERT INTO Equipo (nombre_equipo, ciudad, id_estadio, escudo_url) VALUES
('Millonarios FC', 'Bogotá', 1, 'https://cdn.example.com/millonarios.png'),
('Atlético Nacional', 'Medellín', 2, 'https://cdn.example.com/nacional.png'),
('Junior FC', 'Barranquilla', 3, 'https://cdn.example.com/junior.png');

INSERT INTO EquipoLiga (id_equipo, id_liga, anio) VALUES
(1, 1, 2026), (2, 1, 2026), (3, 1, 2026);

INSERT INTO Jornada (id_liga, anio, numero_jornada, fecha_inicio, fecha_fin) VALUES
(1, 2026, 7, '2026-09-01', '2026-09-07'),
(1, 2026, 8, '2026-09-08', '2026-09-14');

INSERT INTO EstadoPartido (nombre, partido_activo) VALUES
('Programado', 1), ('En juego', 1), ('Finalizado', 0), ('Suspendido', 0);

INSERT INTO Partido (id_jornada, id_equipo_local, id_equipo_visitante, id_estadio, fecha_hora, id_estado, marcador_local, marcador_visitante) VALUES
(1, 1, 2, 1, '2026-09-06 20:00:00', 3, 2, 1),
(2, 3, 1, 3, '2026-09-13 18:00:00', 1, NULL, NULL);
