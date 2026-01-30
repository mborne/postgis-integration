# roadgraph

Dérivation de ROUTE500 en base exploitable par pgrouting et pour expérimentation de 2020 ([github.com - mborne/graph-experiments](https://github.com/mborne/graph-experiments))

## Utilisation

[datasets/roadgraph/sql/schema.sql](sql/schema.sql) et [datasets/roadgraph/sql/import-route500.sql](sql/import-route500.sql) permettent de charger les données :

```bash
# création du schéma roadgraph, des tables, utilitaires et vues
cat datasets/roadgraph/sql/schema.sql | docker exec -i postgis psql -d gis -U postgres
# import des vertex et edges à partir de route500.troncon_de_route
cat datasets/roadgraph/sql/import-route500.sql | docker exec -i postgis psql -d gis -U postgres
```

[datasets/roadgraph/sql/pgrouting-helpers.sql](sql/pgrouting-helpers.sql) assure la définition de fonction de calcul d'isochrones basées sur pgrouting :

```bash
# chargement extension pgrouting
docker exec -i postgis psql -d gis -U postgres -c "CREATE EXTENSION pgrouting"
# création des utilitaires (isochrone et isochrones)
cat datasets/roadgraph/sql/pgrouting-helpers.sql | docker exec -i postgis psql -d gis -U postgres
```

## Ressources

- Site officiel pgrouting : https://pgrouting.org/
- Documentation pgrouting : https://docs.pgrouting.org/latest/en/index.html

