# postgis-integration

[![Experimental](https://img.shields.io/badge/status-experimental-orange)](#)

Helpers scripts to load sample datasets in PostgreSQL/PostGIS mainly focused on french OpenData.

## Motivation

* Rapidly load data for geo experiments (GeoServer, pg_featureserv, …)
* Illustrate the execution of realistic processing workflows with Docker and Kubernetes ([cours-devops](https://mborne.github.io/cours-devops/))

## Datasets

* [naturalearth](./datasets/naturalearth/README.md) (World)
* [adminexpress](./datasets/adminexpress/README.md) (France)
* [bdtopo](./datasets/bdtopo/README.md) (France)
* [osm](./datasets/osm/README.md) (World, some zones here)
* [codes_postaux](./datasets/codes_postaux/README.md) (France)
* [route500](./datasets/route500/README.md) (France, **deprecated**)
* [roadgraph](./datasets/roadgraph/README.md) (France, route500 -> [pgRouting](https://pgrouting.org/) graph experimentation)


## Requirements

The following tools must be available in PATH :

* [uv](https://docs.astral.sh/uv/getting-started/installation/) (see [pyproject.toml](pyproject.toml))
* [ogr2ogr](https://gdal.org/en/stable/programs/ogr2ogr.html) (gdal-bin on debian/ubuntu)
* [osm2pgsql](https://osm2pgsql.org/)

```powershell
# Windows user may use ogr2ogr from QGIS :
$Env:PATH = "$Env:PATH;C:\Program Files\QGIS 3.36.3\bin"
$Env:GDAL_DATA = "C:\Program Files\QGIS 3.36.3\share\proj"
```

* **unzip** for `.zip` archives
* **7z** for `.7z` archives (p7zip-full sur debian/ubuntu)
* **tar** for .tar.gz and .tar.bz2 archives

The PostgreSQL database must be created with PostGIS extension enabled :

```bash
createdb gis
psql -d gis -c "CREATE EXTENSION postgis"
```

## Parameters

> Access to the database relies on [PostgreSQL environment variables](https://www.postgresql.org/docs/17/libpq-envars.html) with default values for [mborne/docker-devbox - postgis](https://github.com/mborne/docker-devbox/tree/master/postgis).

| Variable     | Description                           | Valeur par défaut | Required |
| ------------ | ------------------------------------- | ----------------- | :------: |
| `DATA_DIR`   | Working dir where file are downloaded | `./data`          |    NO    |
| `PGHOST`     | PostgreSQL server host                | localhost         |    NO    |
| `PGPORT`     | PostgreSQL server port                | 5432              |    NO    |
| `PGDATABASE` | PostgreSQL **database name**          | gis               |    NO    |
| `PGUSER`     | PostgreSQL user                       | postgres          |    NO    |
| `PGPASSWORD` | Mot de passe utilisateur              | ChangeIt          |    NO    |

## Installation

```bash
git clone https://github.com/mborne/postgis-integration
cd postgis-integration
uv sync
# check system tools
uv run helpers/gdal.py
```

## Usage

```bash
# configure database access
export PGDATABASE=gis
#...

# import naturalearth
uv run datasets/naturalearth/import.py
# import adminexpress
uv run datasets/adminexpress/import.py
# import OSM by zone (zones in datasets/osm/zones.yaml)
uv run datasets/osm/import.py france
```

## Usage with docker

With the [mborne/docker-devbox - postgis](https://github.com/mborne/docker-devbox/tree/master/postgis#usage-with-docker) container running on network devbox :

```bash
# build image
docker build -t postgis-integration .

# import adminexpress data
docker run --rm -ti \
    --net=devbox \
    -e PGHOST=postgis -e PGDATABASE=gis \
    -e PGUSER=postgres -e PGPASSWORD=ChangeIt \
    postgis-integration uv run datasets/naturalearth/import.py
```

## License

[MIT](LICENSE)



