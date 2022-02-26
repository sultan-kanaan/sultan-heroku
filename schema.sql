DROP TABLE IF EXISTS postgres;

CREATE TABLE IF NOT EXISTS postgres(
id SERIAL PRIMARY KEY,
release_date DATE,
title VARCHAR(1000),
poster_path VARCHAR(1000),
overview VARCHAR(10000),
comment VARCHAR(1000)
);
