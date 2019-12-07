CREATE EXTENSION IF NOT EXISTS postgis;

DROP SCHEMA IF EXISTS route500 CASCADE;
CREATE SCHEMA route500 ;

CREATE TABLE route500.communication_restreinte (
    id_rte500 integer primary key,
    id_nd_rte integer,
    id_tro_ini integer,
    id_tro_fin integer,
    interdit character varying,
    rest_poids double precision,
    rest_haut double precision,
    geom geometry(PointZ,4326)
);
CREATE INDEX ON route500.communication_restreinte USING gist (geom);

CREATE TABLE route500.noeud_routier (
    id_rte500 integer primary key,
    nature character varying,
    geom geometry(PointZ,4326)
);
CREATE INDEX ON route500.noeud_routier USING gist (geom);

CREATE TABLE route500.troncon_route (
    id_rte500 integer primary key,
    vocation character varying,
    nb_chausse character varying,
    nb_voies character varying,
    etat character varying,
    acces character varying,
    res_vert character varying,
    sens character varying,
    res_europe character varying,
    num_route character varying,
    class_adm character varying,
    longueur double precision,
    geom geometry(LineStringZ,4326)
);
CREATE INDEX ON route500.troncon_route USING gist (geom);
