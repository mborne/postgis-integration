CREATE SCHEMA IF NOT EXISTS cog ;

-- https://www.insee.fr/fr/information/2666684#titre-bloc-3
DROP TABLE IF EXISTS cog.commune ;
CREATE TABLE cog.commune
(
  gid serial primary key,
  actual text,
  cheflieu text,
  cdc text,
  rang text,
  reg text,
  dep text,
  com text,
  ar text,
  ct text,
  modif text,
  pole text,
  tncc text,
  artmaj text,
  ncc text,
  artmin text,
  nccenr text,
  articlct text,
  nccct text
);
