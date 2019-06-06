CREATE EXTENSION IF NOT EXISTS postgis;

DROP SCHEMA IF EXISTS cog CASCADE;

CREATE SCHEMA cog;

CREATE TABLE cog.arrondissement (
    id serial primary key,
    arr character varying,
    dep character varying,
    reg character varying,
    cheflieu character varying,
    tncc character varying,
    ncc character varying,
    nccenr character varying,
    libelle character varying
);


CREATE TABLE cog.canton (
    id serial primary key,
    can character varying,
    dep character varying,
    reg character varying,
    compct character varying,
    burcentral character varying,
    tncc character varying,
    ncc character varying,
    nccenr character varying,
    libelle character varying,
    typect character varying
);


CREATE TABLE cog.commune (
    id serial primary key,
    typecom character varying,
    com character varying,
    reg character varying,
    dep character varying,
    arr character varying,
    tncc character varying,
    ncc character varying,
    nccenr character varying,
    libelle character varying,
    can character varying,
    comparent character varying
);


CREATE TABLE cog.departement (
    id serial primary key,
    dep character varying,
    reg character varying,
    cheflieu character varying,
    tncc character varying,
    ncc character varying,
    nccenr character varying,
    libelle character varying
);


CREATE TABLE cog.mvtcommune (
    id serial primary key,
    mod character varying,
    date_eff date,
    typecom_av character varying,
    com_av character varying,
    tncc_av character varying,
    ncc_av character varying,
    nccenr_av character varying,
    libelle_av character varying,
    typecom_ap character varying,
    com_ap character varying,
    tncc_ap character varying,
    ncc_ap character varying,
    nccenr_ap character varying,
    libelle_ap character varying
);


CREATE TABLE cog.pays (
    id serial primary key,
    cog character varying,
    actual character varying,
    capay character varying,
    crpay character varying,
    ani character varying,
    libcog character varying,
    libenr character varying,
    ancnom character varying,
    codeiso2 character varying,
    codeiso3 character varying,
    codenum3 character varying
);


CREATE TABLE cog.region (
    id serial primary key,
    reg character varying,
    cheflieu character varying,
    tncc character varying,
    ncc character varying,
    nccenr character varying,
    libelle character varying
);
