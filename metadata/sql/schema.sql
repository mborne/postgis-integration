CREATE SCHEMA IF NOT EXISTS metadata ;

CREATE TABLE IF NOT EXISTS metadata.dataset
(
    -- "name": "adminexpress",
    name text primary key,
    -- "description": "Régions, départements, EPCI, communes,...",
    description text,
    -- "homepage": "http://professionnels.ign.fr/adminexpress",
    homepage text,
    -- "url": "https://wxs-telechargement.ign.fr/x02uy2aiwjo9bm8ce5plwqmr/telechargement/prepackage/ADMINEXPRESS-PACK_2018-06-14$ADMIN-EXPRESS_1-1__SHP__FRA_2018-06-14/file/ADMIN-EXPRESS_1-1__SHP__FRA_2018-06-14.7z",
    url text,
    -- "version": "2018-06-14"
    version text
);

