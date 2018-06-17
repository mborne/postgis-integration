CREATE SCHEMA IF NOT EXISTS ban ;

DROP TABLE IF EXISTS ban.adresse ;
CREATE TABLE ban.adresse(
    id                   text primary key,
    nom_voie             text,
    id_fantoir           text,
    numero               text,
    rep                  text,
    code_insee           text,
    code_post            text,
    alias                text,
    nom_ld               text,
    nom_afnor            text,
    libelle_acheminement text,
    x                    text,
    y                    text,
    lon                  real,
    lat                  real,
    nom_commune          text,
    geom geometry(Point,4326)
) ;

CREATE OR REPLACE FUNCTION ban.adresse_trigger() RETURNS trigger AS $$
BEGIN
    NEW.geom := ST_SetSRID(ST_MakePoint(NEW.lon,NEW.lat),4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ban_adresse_trigger BEFORE INSERT OR UPDATE ON ban.adresse
    FOR EACH ROW EXECUTE PROCEDURE ban.adresse_trigger();
