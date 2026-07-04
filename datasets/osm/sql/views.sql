-- SET search_path=osm_idf,public;

CREATE OR REPLACE VIEW buildings AS 
SELECT 
	*
FROM polygons
WHERE tags ? 'building'
  AND tags->>'building' != 'no'
;


CREATE OR REPLACE VIEW tourism_points AS 
SELECT 
	*
FROM points
WHERE tags ? 'tourism'
  AND tags->>'tourism' != 'no'
;

 