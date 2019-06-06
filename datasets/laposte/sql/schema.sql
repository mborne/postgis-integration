CREATE SCHEMA IF NOT EXISTS laposte ;

DROP TABLE IF EXISTS laposte.codes_postaux;
CREATE TABLE laposte.codes_postaux (
	id serial primary key,
	nom_de_la_commune text,
	libell_d_acheminement text,
	code_postal text,
	coordonnees_gps float8[],
	code_commune_insee text,
	ligne_5 text,
	geom geometry(Point,4326)
);
CREATE INDEX ON laposte.codes_postaux USING gist (geom);
