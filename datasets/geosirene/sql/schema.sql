CREATE EXTENSION IF NOT EXISTS postgis;

CREATE SCHEMA IF NOT EXISTS sirene ;

DROP TABLE IF EXISTS sirene.etablissement;
CREATE TABLE sirene.etablissement
(
    gid serial primary key,
    siren character varying,
    nic character varying,
    l1_normalisee character varying,
    l2_normalisee character varying,
    l3_normalisee character varying,
    l4_normalisee character varying,
    l5_normalisee character varying,
    l6_normalisee character varying,
    l7_normalisee character varying,
    l1_declaree character varying,
    l2_declaree character varying,
    l3_declareeee character varying,
    l4_declaree character varying,
    l5_declaree character varying,
    l6_declaree character varying,
    l7_declaree character varying,
    numvoie character varying,
    indrep character varying,
    typvoie character varying,
    libvoie character varying,
    codpos character varying,
    cedex character varying,
    rpet character varying,
    libreg character varying,
    depet character varying,
    arronet character varying,
    ctonet character varying,
    comet character varying,
    libcom character varying,
    du character varying,
    tu character varying,
    uu character varying,
    epci character varying,
    tcd character varying,
    zemet character varying,
    siege character varying,
    enseigne character varying,
    ind_publipo character varying,
    diffcom character varying,
    amintret character varying,
    natetab character varying,
    libnatetab character varying,
    apet700 character varying,
    libapet character varying,
    dapet character varying,
    tefet character varying,
    libtefet character varying,
    efetcent character varying,
    defet character varying,
    origine character varying,
    dcret character varying,
    ddebact character varying,
    activnat character varying,
    lieuact character varying,
    actisurf character varying,
    saisonat character varying,
    modet character varying,
    prodet character varying,
    prodpart character varying,
    auxilt character varying,
    nomen_long character varying,
    sigle character varying,
    nom character varying,
    prenom character varying,
    civilite character varying,
    rna character varying,
    nicsiege character varying,
    rpen character varying,
    depcomen character varying,
    adr_mail character varying,
    nj character varying,
    libnj character varying,
    apen700 character varying,
    libapen character varying,
    dapen character varying,
    aprm character varying,
    ess character varying,
    dateess character varying,
    tefen character varying,
    libtefen character varying,
    efencent character varying,
    defen character varying,
    categorie character varying,
    dcren character varying,
    amintren character varying,
    monoact character varying,
    moden character varying,
    proden character varying,
    esaann character varying,
    tca character varying,
    esaapen character varying,
    esasec1n character varying,
    esasec2n character varying,
    esasec3n character varying,
    esasec4n character varying,
    vmaj character varying,
    vmaj1 character varying,
    vmaj2 character varying,
    vmaj3 character varying,
    datemaj character varying,
    latitude character varying,
    longitude character varying,
    geo_score character varying,
    geo_type character varying,
    geo_adresse character varying,
    geo_id character varying,
    geo_ligne character varying,
    geo_l4 character varying,
    geo_l5 character varying,
    geom geometry(Point,4326)
);
-- CREATE INDEX ON sirene.etablissement USING gist (geom);
-- CREATE INDEX ON sirene.etablissement (siren);

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
