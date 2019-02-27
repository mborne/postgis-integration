DROP SCHEMA IF EXISTS cadastre CASCADE ;
CREATE SCHEMA cadastre ;

CREATE TABLE cadastre.commune (
    id text primary key,
    nom character varying,
    created date,
    updated date,
    geom geometry(MultiPolygon,4326)
);


CREATE TABLE cadastre.section (
    id text primary key,
    commune character varying,
    prefixe character varying,
    code character varying,
    created date,
    updated date,
    geom geometry(MultiPolygon,4326)
);


CREATE TABLE cadastre.feuille (
    id text primary key,
    commune character varying,
    prefixe character varying,
    section character varying,
    numero character varying,
    qualite character varying,
    modeconfec character varying,
    echelle double precision,
    created date,
    updated date,
    geom geometry(MultiPolygon,4326)
);


CREATE TABLE cadastre.parcelle (
    id text primary key,
    commune character varying,
    prefixe character varying,
    section character varying,
    numero character varying,
    contenance double precision,
    created date,
    updated date,
    geom geometry(MultiPolygon,4326)
);


CREATE TABLE cadastre.batiment (
    id serial primary key,
    type character varying,
    commune character varying,
    nom character varying,
    created date,
    updated date,
    geom geometry(MultiPolygon,4326)
);

