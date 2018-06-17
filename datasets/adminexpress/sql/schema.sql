CREATE SCHEMA IF NOT EXISTS adminexpress ;

-- REGION
DROP TABLE IF EXISTS adminexpress.region ;
CREATE TABLE adminexpress.region
(
    gid serial primary key,
    id character varying(24),
    nom_reg character varying(35),
    insee_reg character varying(2),
    geom geometry(MultiPolygon,4326)
);
CREATE INDEX ON adminexpress.region USING gist (geom);

-- DEPARTEMENT
DROP TABLE IF EXISTS adminexpress.departement ;
CREATE TABLE adminexpress.departement
(
    gid serial primary key,    
    id character varying(24),
    nom_dep character varying(30),
    insee_dep character varying(3),
    insee_reg character varying(2),
    geom geometry(MultiPolygon,4326)
);
CREATE INDEX ON adminexpress.departement USING gist (geom);

-- ARRONDISSEMENT_DEPARTEMENTAL
DROP TABLE IF EXISTS adminexpress.arrondissement_departemental ;
CREATE TABLE adminexpress.arrondissement_departemental
(
    gid serial primary key,    
    id character varying(24),
    insee_arr character varying(1),
    insee_dep character varying(3),
    insee_reg character varying(2),
    geom geometry(MultiPolygon,4326)
);
CREATE INDEX ON adminexpress.arrondissement_departemental USING gist (geom);

-- EPCI
DROP TABLE IF EXISTS adminexpress.epci ;
CREATE TABLE adminexpress.epci
(
    gid serial primary key,    
    id character varying(24),
    code_epci character varying(9),
    nom_epci character varying(230),
    type_epci character varying(9),
    geom geometry(MultiPolygon,4326)
);
CREATE INDEX ON adminexpress.epci USING gist (geom);

-- COMMUNE
DROP TABLE IF EXISTS adminexpress.commune ;
CREATE TABLE adminexpress.commune
(
    gid serial primary key,    
    id character varying(24),
    nom_com character varying(50),
    nom_com_m character varying(50),
    insee_com character varying(5),
    statut character varying(24),
    population numeric(8,0),
    insee_arr character varying(2),
    nom_dep character varying(30),
    insee_dep character varying(3),
    nom_reg character varying(35),
    insee_reg character varying(2),
    code_epci character varying(9),
    geom geometry(MultiPolygon,4326)
);
CREATE INDEX ON adminexpress.commune USING gist (geom);

-- CHEF_LIEU
DROP TABLE IF EXISTS adminexpress.chef_lieu ;
CREATE TABLE adminexpress.chef_lieu
(
    gid serial primary key,    
    id character varying(24),
    nom_chf character varying(60),
    statut character varying(24),
    insee_com character varying(5),
    geom geometry(MultiPoint,4326)
);
CREATE INDEX ON adminexpress.chef_lieu USING gist (geom);
