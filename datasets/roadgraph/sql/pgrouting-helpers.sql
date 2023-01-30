
CREATE EXTENSION IF NOT EXISTS pgrouting;

-- Résultat calcul isochrone
CREATE TYPE roadgraph.isochrone_t as (id int, time real, geom geometry);

-- Calcul d'une isochrone à partir d'une l'origine avec un temps en seconde
CREATE OR REPLACE FUNCTION roadgraph.isochrone(_origin int, _time real) RETURNS setof roadgraph.isochrone_t as $BODY$
  	select
		(row_number() over())::int as id,
	   _time as time,
		ST_ConcaveHull(ST_Collect(v.geom),0.8) as geom
	from public.pgr_drivingDistance(
	   'SELECT id, source, target, cost, reverse_cost FROM roadgraph.edge_time_weighted WHERE geom && roadgraph.vertex_buffer('||_origin||','||(_time*150/3.6)||')',
	   _origin, _time, true
	) rc
	join roadgraph.vertex v on v.id = rc.node
$BODY$ LANGUAGE sql;


-- Calcul de plusieurs isochrones à partir d'une l'origine avec un temps en seconde
CREATE OR REPLACE FUNCTION roadgraph.isochrones(_origin int, _times real[]) RETURNS setof roadgraph.isochrone_t as $BODY$
DECLARE
	max_time real;
	res roadgraph.isochrone_t%rowtype;
BEGIN
	SELECT max(times.time) INTO max_time FROM (
		SELECT unnest(_times) AS time
	) times ;

	FOR res IN
		WITH times AS (
			SELECT
				unnest(_times) AS time
		), reached AS (
			SELECT
				rc.node,
				rc.agg_cost,
				v.geom
			from public.pgr_drivingDistance(
			   'SELECT id, source, target, cost, reverse_cost FROM roadgraph.edge_time_weighted WHERE geom && roadgraph.vertex_buffer('||_origin||','||max_time||'*150/3.6)',
			   _origin,
			   max_time,
			   true
			) rc
			join roadgraph.vertex v on v.id = rc.node
		)
		SELECT
			(row_number() over())::int as id,
			t.time,
			( SELECT ST_ConcaveHull(ST_Collect(r.geom),0.8) FROM reached r WHERE r.agg_cost <= t.time ) as geom
		FROM times t

    LOOP
        RETURN NEXT res;
    END LOOP;
    RETURN;

END
$BODY$ LANGUAGE plpgsql;

