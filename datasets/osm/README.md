# OSM

Helper script to import OSM data for some zones.

## Usage

### Import data

See [zones.yaml](zones.yaml) :

```bash
uv run datasets/osm/import.py idf
```

### Create some views

See [datasets/osm/sql/view.sql](sql/views.sql)

## Ressources

- https://www.openstreetmap.org/
- https://download.geofabrik.de/
- https://osm2pgsql.org/
- https://wiki.openstreetmap.org/wiki/Map_features
- https://devhints.io/postgresql-json
