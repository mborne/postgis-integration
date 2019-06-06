CREATE EXTENSION IF NOT EXISTS postgis;

CREATE SCHEMA IF NOT EXISTS adminexpress ;

-- REGION
DROP TABLE IF EXISTS adminexpress.region ;
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
DROP TABLE IF EXISTS adminexpress.departement ;
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
DROP TABLE IF EXISTS adminexpress.arrondissement_departemental ;
CREATE TABLE adminexpress.arrondissement_departemental
(
    gid serial primary key,
    id text,
    nom_arr text,
    nom_arr_m text,
    insee_arr text,
    insee_dep text,
    insee_reg text,
    chf_arr text,
    geom geometry(MultiPolygon,4326)
);
CREATE INDEX ON adminexpress.arrondissement_departemental USING gist (geom);

-- EPCI
DROP TABLE IF EXISTS adminexpress.epci ;
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
DROP TABLE IF EXISTS adminexpress.commune ;
CREATE TABLE adminexpress.commune
(
    gid serial primary key,
    id text,
    type text,
    nom_com text,
    nom_com_m text,
    insee_com text,
    statut text,
    population numeric(8,0),
    insee_arr text,
    nom_dep text,
    insee_dep text,
    nom_reg text,
    insee_reg text,
    code_epci text,
    geom geometry(MultiPolygon,4326)
);
CREATE INDEX ON adminexpress.commune USING gist (geom);

-- CHEF_LIEU
DROP TABLE IF EXISTS adminexpress.chef_lieu ;
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
