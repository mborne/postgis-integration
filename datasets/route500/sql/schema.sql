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
    -- 'Liaison locale', 'Liaison principale', 'Liaison régionale' ou 'Type autoroutier'
    vocation character varying,
    -- '1 chaussée' ou '2 chaussées'
    nb_chausse character varying,
    -- '1 voie ou 2 voies étroites', '2 voies larges', '3 voies',
    -- '4 voies', 'Plus de 4 voies' ou 'Sans objet'
    nb_voies character varying,
    -- 'Revêtu' ou 'Non revêtu'
    etat character varying,
    -- 'A péage', 'Inconnu', 'Libre' ou 'Saisonnier'
    acces character varying,
    -- 'Appartient' ou 'N''appartient pas'
    res_vert character varying,
    -- 'Double sens', 'Sens unique' ou 'Sens inverse'
    sens character varying,
    -- numéro de route européenne (ex : 'E20')
    res_europe character varying,
    -- numéro de route (ex : 'D20')
    num_route character varying,
    -- 'Autoroute', 'Départementale', 'Nationale' ou 'Sans objet'
    class_adm character varying,
    longueur double precision,
    geom geometry(LineStringZ,4326)
);
CREATE INDEX ON route500.troncon_route USING gist (geom);


create view route500.statistiques AS
	select 'sens' as name, sens as value, count(*) from route500.troncon_route tr group by sens
		union all
	select 'class_adm' as name, class_adm as value, count(*) from route500.troncon_route tr group by class_adm
		union all
	select 'acces' as name, acces as value, count(*) from route500.troncon_route tr group by acces
		union all
	select 'nb_chausse' as name, nb_chausse as value, count(*) from route500.troncon_route tr group by nb_chausse
		union all
	select 'nb_voies' as name, nb_voies as value, count(*) from route500.troncon_route tr group by nb_voies
		union all
	select 'etat' as name, etat as value, count(*) from route500.troncon_route tr group by etat
		union all
	select 'vocation' as name, vocation as value, count(*) from route500.troncon_route tr group by vocation
		union all
	select 'res_vert' as name, res_vert as value, count(*) from route500.troncon_route tr group by res_vert
;
