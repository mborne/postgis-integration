CREATE EXTENSION IF NOT EXISTS postgis;

CREATE SCHEMA IF NOT EXISTS sirene ;

DROP TABLE IF EXISTS sirene.etablissement;
CREATE TABLE sirene.etablissement
(
    gid serial primary key,
    siren character varying,
    nic character varying,
    siret character varying,
    statutdiffusionetablissement character varying,
    datecreationetablissement character varying,
    trancheeffectifsetablissement character varying,
    anneeeffectifsetablissement character varying,
    activiteprincipaleregistremetiersetablissement character varying,
    datederniertraitementetablissement character varying,
    etablissementsiege character varying,
    nombreperiodesetablissement character varying,
    complementadresseetablissement character varying,
    numerovoieetablissement character varying,
    indicerepetitionetablissement character varying,
    typevoieetablissement character varying,
    libellevoieetablissement character varying,
    codepostaletablissement character varying,
    libellecommuneetablissement character varying,
    libellecommuneetrangeretablissement character varying,
    distributionspecialeetablissement character varying,
    codecommuneetablissement character varying,
    codecedexetablissement character varying,
    libellecedexetablissement character varying,
    codepaysetrangeretablissement character varying,
    libellepaysetrangeretablissement character varying,
    complementadresse2etablissement character varying,
    numerovoie2etablissement character varying,
    indicerepetition2etablissement character varying,
    typevoie2etablissement character varying,
    libellevoie2etablissement character varying,
    codepostal2etablissement character varying,
    libellecommune2etablissement character varying,
    libellecommuneetranger2etablissement character varying,
    distributionspeciale2etablissement character varying,
    codecommune2etablissement character varying,
    codecedex2etablissement character varying,
    libellecedex2etablissement character varying,
    codepaysetranger2etablissement character varying,
    libellepaysetranger2etablissement character varying,
    datedebut character varying,
    etatadministratifetablissement character varying,
    enseigne1etablissement character varying,
    enseigne2etablissement character varying,
    enseigne3etablissement character varying,
    denominationusuelleetablissement character varying,
    activiteprincipaleetablissement character varying,
    nomenclatureactiviteprincipaleetablissement character varying,
    caractereemployeuretablissement character varying,
    longitude character varying,
    latitude character varying,
    geo_score character varying,
    geo_type character varying,
    geo_adresse character varying,
    geo_id character varying,
    geo_ligne character varying,
    geo_l4 character varying,
    geo_l5 character varying
    geom geometry(Point,4326)
);
CREATE INDEX ON sirene.etablissement USING gist (geom);
CREATE INDEX ON sirene.etablissement (siren);

CREATE OR REPLACE FUNCTION sirene.etablissement_trigger() RETURNS trigger AS $$
BEGIN
    NEW.longitude := NULLIF(NEW.longitude,'');
    NEW.latitude := NULLIF(NEW.latitude,'');
    IF NEW.longitude IS NOT NULL AND NEW.latitude IS NOT NULL THEN
        NEW.geom := ST_SetSRID(ST_MakePoint(NEW.longitude::real,NEW.latitude::real),4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sirene_etablissement_trigger BEFORE INSERT OR UPDATE ON sirene.etablissement
    FOR EACH ROW EXECUTE PROCEDURE sirene.etablissement_trigger();
