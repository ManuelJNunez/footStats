CREATE TABLE IF NOT EXISTS users (
    "userId" SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    nickname VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS matches (
    "matchId" SERIAL PRIMARY KEY,
    "horaIni" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaFin" timestamp NOT NULL,
    lugar VARCHAR(30),
    "userId" INT,
    CONSTRAINT userId FOREIGN KEY ("userId") REFERENCES users("userId")
);