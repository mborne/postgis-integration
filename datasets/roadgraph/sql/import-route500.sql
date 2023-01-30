DELETE FROM roadgraph.edge;
DELETE FROM roadgraph.vertex;

-- création des sommets à partir des données route500
INSERT INTO roadgraph.vertex(x,y,geom)
    SELECT
        ST_X(t.geom),
        ST_Y(t.geom),
        ST_Force2D(t.geom)
    FROM (
        SELECT ST_StartPoint(geom) as geom FROM route500.troncon_route
            UNION
        SELECT ST_EndPoint(geom) as geom FROM route500.troncon_route
    ) t WHERE roadgraph.vertex_id(t.geom) IS NULL;

-- création des arcs à partir des données route500
INSERT INTO roadgraph.edge(
    source,
    target,
    direction,
    name,
    importance,
    speed,
    geom
)
SELECT
    roadgraph.vertex_id(ST_StartPoint(t.geom)),
    roadgraph.vertex_id(ST_EndPoint(t.geom)),
    (CASE
        WHEN t.sens='Sens unique' THEN 1
        WHEN t.sens='Sens inverse' THEN -1
        ELSE 0
    END) as direction,
    t.num_route as name,
    (CASE
        WHEN t.vocation='Type autoroutier' THEN 5
        WHEN t.vocation='Liaison régionale' THEN 4
        WHEN t.vocation='Liaison principale' THEN 3
        WHEN t.vocation='Liaison locale' THEN 2
        ELSE 1
    END) as importance,
    (CASE
        WHEN t.class_adm='Autoroute' THEN 130.0
        WHEN (t.class_adm='Sans objet' OR t.etat = 'Non revêtu') THEN 30.0
        ELSE 80.0
    END) as speed,
    ST_Force2D(t.geom) as geom
FROM route500.troncon_route t
;