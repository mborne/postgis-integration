DROP SCHEMA IF EXISTS roadgraph CASCADE;
CREATE SCHEMA roadgraph;

----------------------------------------------------------------
-- Données
----------------------------------------------------------------

-- table des sommets
CREATE TABLE roadgraph.vertex (
    id serial primary key,
    x double precision,
    y double precision,
    geom geometry(Point,4326)
);
CREATE INDEX ON roadgraph.vertex (x,y);
CREATE INDEX ON roadgraph.vertex USING gist (geom);

-- table des arcs
CREATE TABLE roadgraph.edge (
    id serial primary key,
    source integer references roadgraph.vertex(id),
    target integer references roadgraph.vertex(id),
    -- direction (both: 0, direct: 1, reverse: -1)
    direction integer DEFAULT 0,
    -- name of the road (ex : A36)
    name text,
    -- importance of the road (0 to 5)
    importance integer DEFAULT 1,
    -- speed factor
    speed real DEFAULT 50.0,
    -- shape of the road
    geom geometry(LineString,4326)
);
CREATE INDEX ON roadgraph.edge(source);
CREATE INDEX ON roadgraph.edge(target);
CREATE INDEX ON roadgraph.edge USING gist (geom);

----------------------------------------------------------------
-- Vues
----------------------------------------------------------------

-- arcs avec cost et reverse_cost fonction de la longueur
CREATE VIEW roadgraph.edge_distance_weighted AS
    SELECT
        e.*,
        (CASE
            WHEN e.direction >= 0 THEN ST_Length(e.geom::geography)
            ELSE -1.0
        END) as cost,
        (CASE
            WHEN e.direction <= 0 THEN ST_Length(e.geom::geography)
            ELSE -1.0
        END) as reverse_cost
    FROM roadgraph.edge e
;

-- arcs avec cost et reverse_cost fonction du temps de parcours en seconde
CREATE VIEW roadgraph.edge_time_weighted AS
    SELECT
        e.*,
        (CASE
            WHEN e.direction >= 0 THEN 3.6 * ST_Length(e.geom::geography) / e.speed
            ELSE -1.0
        END) as cost,
        (CASE
            WHEN e.direction <= 0 THEN 3.6 * ST_Length(e.geom::geography) / e.speed
            ELSE -1.0
        END) as reverse_cost
    FROM roadgraph.edge e
;

----------------------------------------------------------------
-- Utilitaires
----------------------------------------------------------------

-- Recherche d'un sommet par position
CREATE OR REPLACE FUNCTION roadgraph.vertex_id( _geom geometry ) RETURNS integer AS $$
    SELECT id FROM roadgraph.vertex WHERE x = ST_X(_geom) AND y = ST_Y(_geom);
$$ LANGUAGE SQL STABLE;

-- Création d'un sommet en fonction d'une position
CREATE OR REPLACE FUNCTION roadgraph.create_vertex( _geom geometry ) RETURNS integer AS $$
DECLARE
    ret_id integer := NULL ;
BEGIN
    ret_id := roadgraph.vertex_id(_geom);
    IF ret_id IS NOT NULL
    THEN
	RETURN ret_id;
    END IF;

    INSERT INTO roadgraph.vertex(x,y,geom) VALUES (ST_X(_geom),ST_Y(_geom),ST_Force2D(_geom)) RETURNING id INTO ret_id;
    RETURN ret_id;
END;
$$ LANGUAGE plpgsql ;


-- SELECT * FROM roadgraph.create_vertex(ST_SetSRID('POINT(3.0 4.0)'::geometry,4326));
-- SELECT * FROM roadgraph.create_vertex(ST_SetSRID('POINT(4.0 5.0)'::geometry,4326));

-- calcul d'un buffer autour d'un sommet avec une distance métrique
CREATE OR REPLACE FUNCTION roadgraph.vertex_buffer(_id int, _distance REAL) RETURNS geometry AS $BODY$
	SELECT ST_Buffer(geom::geography,_distance)::geometry FROM roadgraph.vertex v WHERE v.id = _id;
$BODY$ LANGUAGE SQL STABLE ;


