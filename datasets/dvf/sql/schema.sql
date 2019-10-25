CREATE EXTENSION IF NOT EXISTS postgis;

CREATE SCHEMA IF NOT EXISTS dvf ;

DROP TABLE IF EXISTS dvf.mutation;
CREATE TABLE dvf.mutation (
	gid serial primary key,
	id_mutation varchar,
	date_mutation date,
	numero_disposition varchar,
	nature_mutation varchar,
	valeur_fonciere real,
	adresse_numero varchar,
	adresse_suffixe varchar,
	adresse_nom_voie varchar,
	adresse_code_voie varchar,
	code_postal varchar,
	code_commune varchar,
	nom_commune varchar,
	code_departement varchar,
	ancien_code_commune varchar,
	ancien_nom_commune varchar,
	id_parcelle varchar,
	ancien_id_parcelle varchar,
	numero_volume varchar,
	lot1_numero varchar,
	lot1_surface_carrez varchar,
	lot2_numero varchar,
	lot2_surface_carrez varchar,
	lot3_numero varchar,
	lot3_surface_carrez varchar,
	lot4_numero varchar,
	lot4_surface_carrez varchar,
	lot5_numero varchar,
	lot5_surface_carrez varchar,
	nombre_lots varchar,
	code_type_local integer,
	type_local varchar,
	surface_reelle_bati real,
	nombre_pieces_principales integer,
	code_nature_culture varchar,
	nature_culture varchar,
	code_nature_culture_speciale varchar,
	nature_culture_speciale varchar,
	surface_terrain real,
	longitude real,
	latitude real,
    geom geometry(Point,4326)
);
CREATE INDEX ON dvf.mutation USING gist (geom);
CREATE INDEX ON dvf.mutation(id_mutation);
CREATE INDEX ON dvf.mutation(code_postal);
CREATE INDEX ON dvf.mutation(code_commune);
CREATE INDEX ON dvf.mutation(type_local);

CREATE OR REPLACE FUNCTION dvf.mutation_trigger() RETURNS trigger AS $$
BEGIN
    IF NEW.longitude IS NOT NULL AND NEW.latitude IS NOT NULL THEN
        NEW.geom := ST_SetSRID(ST_MakePoint(NEW.longitude::real,NEW.latitude::real),4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dvf_mutation_trigger BEFORE INSERT OR UPDATE ON dvf.mutation
    FOR EACH ROW EXECUTE PROCEDURE dvf.mutation_trigger();
