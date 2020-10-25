CREATE EXTENSION IF NOT EXISTS postgis;

CREATE SCHEMA IF NOT EXISTS adminexpress ;

DROP TABLE IF EXISTS adminexpress.region CASCADE ;
DROP TABLE IF EXISTS adminexpress.departement CASCADE ;
DROP TABLE IF EXISTS adminexpress.arrondissement_departemental CASCADE ;
DROP TABLE IF EXISTS adminexpress.commune CASCADE ;
DROP TABLE IF EXISTS adminexpress.epci CASCADE ;
DROP TABLE IF EXISTS adminexpress.chef_lieu CASCADE ;


-- REGION
CREATE TABLE adminexpress.region
(
    gid serial primary key,
    id text,
    nom_reg text,
    nom_reg_m text,
    insee_reg text,
    chf_reg text,
    geom geometry(MultiPolygon,4326)
);
CREATE INDEX ON adminexpress.region USING gist (geom);

-- DEPARTEMENT
CREATE TABLE adminexpress.departement
(
    gid serial primary key,
    id text,
    nom_dep text,
    nom_dep_m text,
    insee_dep text,
    insee_reg text,
    chf_dep text,
    geom geometry(MultiPolygon,4326)
);
CREATE INDEX ON adminexpress.departement USING gist (geom);

-- ARRONDISSEMENT_DEPARTEMENTAL
CREATE TABLE adminexpress.arrondissement_departemental
(
    gid serial primary key,
    id text,
    insee_arr text,
    insee_dep text,
    insee_reg text,
    chf_arr text,
    nom_arr_m text,
    nom_arr text,
    geom geometry(MultiPolygon,4326)
);
CREATE INDEX ON adminexpress.arrondissement_departemental USING gist (geom);

-- EPCI
CREATE TABLE adminexpress.epci
(
    gid serial primary key,
    id text,
    code_epci text,
    nom_epci text,
    type_epci text,
    geom geometry(MultiPolygon,4326)
);
CREATE INDEX ON adminexpress.epci USING gist (geom);

-- COMMUNE
CREATE TABLE adminexpress.commune
(
    gid serial primary key,
    id text,
    nom_com text,
    nom_com_m text,
    insee_com text,
    statut text,
    insee_can text,
    insee_arr text,
    insee_dep text,
    insee_reg text,
    code_epci text,
    population bigint,
    type text,
    geom geometry(MultiPolygon,4326)
);
CREATE INDEX ON adminexpress.commune USING gist (geom);

-- CHEF_LIEU
CREATE TABLE adminexpress.chef_lieu
(
    gid serial primary key,
    id text,
    nom_chf text,
    statut text,
    insee_com text,
    geom geometry(MultiPoint,4326)
);
CREATE INDEX ON adminexpress.chef_lieu USING gist (geom);
