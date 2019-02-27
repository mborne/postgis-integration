CREATE SCHEMA IF NOT EXISTS dila ;

DROP TABLE IF EXISTS dila.organisme;
CREATE TABLE dila.organisme (
    id text primary key,
    insee text,
    date_maj date,
    pivot_local text,
    nom text,
    source text,
    email text,
    commentaire text,
    geom geometry(MultiPoint,4326)
);
