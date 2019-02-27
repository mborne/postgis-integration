CREATE INDEX ON cadastre.commune USING gist (geom);
CREATE INDEX ON cadastre.section USING gist (geom);
CREATE INDEX ON cadastre.feuille USING gist (geom);
CREATE INDEX ON cadastre.parcelle USING gist (geom);
CREATE INDEX ON cadastre.batiment USING gist (geom);
