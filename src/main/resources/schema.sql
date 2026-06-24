-- ============================================================
-- F1 STATS - Schema completo
-- ============================================================

-- Equipos
CREATE TABLE IF NOT EXISTS equipo (
                                      id     SERIAL PRIMARY KEY,
                                      nombre VARCHAR(100) UNIQUE NOT NULL
    );

-- Autos (pertenecen a un equipo)
CREATE TABLE IF NOT EXISTS auto (
                                    id SERIAL PRIMARY KEY,
                                    modelo VARCHAR(100) NOT NULL UNIQUE,
    equipo_id INT NOT NULL REFERENCES equipo(id)
    );

-- Conductores (pertenecen a un equipo)
CREATE TABLE IF NOT EXISTS conductor (
                                         id        SERIAL PRIMARY KEY,
                                         nombre    VARCHAR(100) NOT NULL,
    equipo_id INT NOT NULL REFERENCES equipo(id),

    CONSTRAINT uq_conductor_nombre_equipo
    UNIQUE (nombre, equipo_id)
    );

-- Circuitos
CREATE TABLE IF NOT EXISTS circuito (
                                        id       SERIAL PRIMARY KEY,
                                        nombre   VARCHAR(100) UNIQUE NOT NULL,
    pais     VARCHAR(100) NOT NULL,
    longitud DOUBLE PRECISION NOT NULL
    );

-- Carreras (se corren en un circuito)
CREATE TABLE IF NOT EXISTS carrera (
                                       id          SERIAL PRIMARY KEY,
                                       nombre      VARCHAR(100) UNIQUE NOT NULL,
    fecha       DATE NOT NULL,
    circuito_id INT NOT NULL REFERENCES circuito(id)
    );

-- Resultados de carrera
CREATE TABLE IF NOT EXISTS resultado_carrera (
                                                 id           SERIAL PRIMARY KEY,
                                                 carrera_id   INT NOT NULL REFERENCES carrera(id),
    conductor_id INT NOT NULL REFERENCES conductor(id),
    posicion     INT NOT NULL CHECK (posicion > 0),
    puntos       INT NOT NULL CHECK (puntos >= 0),
    auto_id      INT NOT NULL REFERENCES auto(id),
    tiempo       VARCHAR(20),
    CONSTRAINT uq_resultado_carrera_conductor
    UNIQUE (carrera_id, conductor_id),
    CONSTRAINT uq_resultado_carrera_posicion
    UNIQUE (carrera_id, posicion)
    );

-- Usuarios del sistema
CREATE TABLE IF NOT EXISTS usuario (
                                       id       SERIAL PRIMARY KEY,
                                       username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,   -- BCrypt hash
    role     VARCHAR(20)  NOT NULL    -- 'ADMIN' o 'USER'
    );

-- ============================================================
-- DATOS DE PRUEBA
-- ============================================================

-- Usuarios
-- Passwords hasheadas con BCrypt (costo 10):
--   admin123  →  $2b$10$zPs5r4jJfcV6aA1oC7o/0.QbXHiULTJCUXeGbep/hbJBaOoQlgULS
--   user123   →  $2b$10$Lx8qznnkrxvxswA2l5ZXvejgrnvRdqQA.iPn1PTl4tnbsazSkufpG
INSERT INTO usuario (username, password, role)
VALUES
    ('admin', '$2b$10$zPs5r4jJfcV6aA1oC7o/0.QbXHiULTJCUXeGbep/hbJBaOoQlgULS', 'ADMIN'),
    ('user',  '$2b$10$Lx8qznnkrxvxswA2l5ZXvejgrnvRdqQA.iPn1PTl4tnbsazSkufpG', 'USER')
    ON CONFLICT (username) DO NOTHING;

-- Equipos
INSERT INTO equipo (nombre) VALUES
                                ('Red Bull Racing'),
                                ('Mercedes AMG'),
                                ('Ferrari'),
                                ('McLaren'),
                                ('Aston Martin'),
                                ('Alpine'),
                                ('Williams'),
                                ('Alfa Romeo'),
                                ('Haas F1 Team'),
                                ('AlphaTauri'),
                                ('Porsche Racing'),
                                ('Audi Sport F1'),
                                ('Toyota Gazoo Racing'),
                                ('Honda Racing'),
                                ('BMW Motorsport'),
                                ('Renault Sport'),
                                ('Jaguar Racing'),
                                ('Lotus F1'),
                                ('Sauber F1'),
                                ('Force India')
    ON CONFLICT (nombre) DO NOTHING;

-- Conductores
INSERT INTO conductor (nombre, equipo_id) VALUES
                                              ('Max Verstappen', 1),
                                              ('Sergio Pérez', 1),
                                              ('Lewis Hamilton', 2),
                                              ('George Russell', 2),
                                              ('Charles Leclerc', 3),
                                              ('Carlos Sainz', 3),
                                              ('Lando Norris', 4),
                                              ('Oscar Piastri', 4),
                                              ('Fernando Alonso', 5),
                                              ('Lance Stroll', 5),
                                              ('Esteban Ocon', 6),
                                              ('Pierre Gasly', 6),
                                              ('Alexander Albon', 7),
                                              ('Logan Sargeant', 7),
                                              ('Valtteri Bottas', 8),
                                              ('Zhou Guanyu', 8),
                                              ('Kevin Magnussen', 9),
                                              ('Nico Hülkenberg', 9),
                                              ('Yuki Tsunoda', 10),
                                              ('Daniel Ricciardo', 10)
    ON CONFLICT DO NOTHING;

-- Autos
INSERT INTO auto (modelo, equipo_id) VALUES
                                         ('RB20', 1),
                                         ('W15', 2),
                                         ('SF-24', 3),
                                         ('MCL38', 4),
                                         ('AMR24', 5),
                                         ('A524', 6),
                                         ('FW46', 7),
                                         ('C44', 8),
                                         ('VF-24', 9),
                                         ('AT05', 10),
                                         ('Porsche-1', 11),
                                         ('Audi-1', 12),
                                         ('Toyota-1', 13),
                                         ('Honda-1', 14),
                                         ('BMW-1', 15),
                                         ('Renault-1', 16),
                                         ('Jaguar-1', 17),
                                         ('Lotus-1', 18),
                                         ('Sauber-1', 19),
                                         ('Force-1', 20)
    ON CONFLICT DO NOTHING;

-- Circuitos
INSERT INTO circuito (nombre, pais, longitud) VALUES
                                                  ('Monza', 'Italia', 5.793),
                                                  ('Monaco', 'Mónaco', 3.337),
                                                  ('Silverstone', 'Reino Unido', 5.891),
                                                  ('Spa-Francorchamps', 'Bélgica', 7.004),
                                                  ('Suzuka', 'Japón', 5.807),
                                                  ('Interlagos', 'Brasil', 4.309),
                                                  ('Albert Park', 'Australia', 5.278),
                                                  ('Circuit of the Americas', 'EEUU', 5.513),
                                                  ('Yas Marina', 'EAU', 5.281),
                                                  ('Bahrain International', 'Bahréin', 5.412),
                                                  ('Jeddah Corniche', 'Arabia Saudita', 6.174),
                                                  ('Imola', 'Italia', 4.909),
                                                  ('Hungaroring', 'Hungría', 4.381),
                                                  ('Zandvoort', 'Países Bajos', 4.259),
                                                  ('Montreal', 'Canadá', 4.361),
                                                  ('Singapore Street', 'Singapur', 4.940),
                                                  ('Mexico City', 'México', 4.304),
                                                  ('Las Vegas Strip', 'EEUU', 6.201),
                                                  ('Hockenheim', 'Alemania', 4.574),
                                                  ('Portimao', 'Portugal', 4.653)
    ON CONFLICT (nombre) DO NOTHING;

-- Carreras
INSERT INTO carrera (nombre, fecha, circuito_id) VALUES
                                                     ('GP Italia 2024', '2024-09-01', 1),
                                                     ('GP Mónaco 2024', '2024-05-26', 2),
                                                     ('GP Reino Unido 2024', '2024-07-07', 3),
                                                     ('GP Bélgica 2024', '2024-08-25', 4),
                                                     ('GP Japón 2024', '2024-04-07', 5),
                                                     ('GP Brasil 2024', '2024-11-03', 6),
                                                     ('GP Australia 2024', '2024-03-24', 7),
                                                     ('GP USA 2024', '2024-10-20', 8),
                                                     ('GP Abu Dhabi 2024', '2024-12-08', 9),
                                                     ('GP Bahréin 2024', '2024-03-02', 10),
                                                     ('GP Arabia Saudita 2024', '2024-03-09', 11),
                                                     ('GP Imola 2024', '2024-05-19', 12),
                                                     ('GP Hungría 2024', '2024-07-21', 13),
                                                     ('GP Holanda 2024', '2024-08-25', 14),
                                                     ('GP Canadá 2024', '2024-06-09', 15),
                                                     ('GP Singapur 2024', '2024-09-15', 16),
                                                     ('GP México 2024', '2024-10-27', 17),
                                                     ('GP Las Vegas 2024', '2024-11-23', 18),
                                                     ('GP Alemania 2024', '2024-07-14', 19),
                                                     ('GP Portugal 2024', '2024-05-05', 20)
    ON CONFLICT (nombre) DO NOTHING;

-- Resultados (carrera 1 - Monza)
INSERT INTO resultado_carrera (carrera_id, conductor_id, posicion, puntos, auto_id, tiempo) VALUES
                                                                                                (1, 1, 1, 25, 1, '1:20:10.111'),
                                                                                                (1, 3, 2, 18, 2, '+2.110s'),
                                                                                                (2, 5, 1, 25, 3, '1:45:11.500'),
                                                                                                (2, 6, 2, 18, 3, '+3.221s'),
                                                                                                (3, 7, 1, 25, 4, '1:30:45.900'),
                                                                                                (3, 8, 2, 18, 4, '+1.845s'),
                                                                                                (4, 9, 1, 25, 5, '1:28:33.210'),
                                                                                                (5, 10, 1, 25, 5, '1:32:44.300'),
                                                                                                (6, 11, 1, 25, 6, '1:40:12.777'),
                                                                                                (7, 12, 1, 25, 6, '1:29:55.600')
    ON CONFLICT DO NOTHING;