# postgis-integration

**!!! Warning : Personal and experimental project to explore opendata resources!!!**

## Description

> Helpers to load sample datasets in PostgreSQL/PostGIS mainly focused on french OpenData.

Ce dépôt contient des scripts d'intégration de données ouvertes dans PostgreSQL/PostGIS et les utilitaires associés (ex : [helpers/gdal.py](helpers/gdal.py) pour l'utilisation de [ogr2ogr](https://gdal.org/en/stable/drivers/vector/index.html))

## Jeux de données

**ATTENTION** : Reportez-vous aux descriptions des jeux de données pour connaître les conditions d'utilisation et licences exactes.

| Nom                                               | Description                                                                                                                                                 |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [naturalearth](./datasets/naturalearth/README.md) | Jeux de données de couverture mondiale (Pays, ports, lacs, batymétrie, etc.)                                                                                |
| [adminexpress](./datasets/adminexpress/README.md) | Région, département, commune, etc. (IGN)                                                                                                                    |
| [route500](./datasets/route500/README.md)         | Réseau routier à petite échelle (**déprécié**)                                                                                                              |
| [roadgraph](./datasets/roadgraph/README.md)       | Dérivation route500 en graphe [pgRouting](https://pgrouting.org/)  (**déprécié** - [mborne/graph-experiments](https://github.com/mborne/graph-experiments)) |

## Utilisation

### Installation des composants systèmes

| Nom                                                           | Description                                                                              |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [uv](https://docs.astral.sh/uv/getting-started/installation/) | Gestionnaire de dépendances et de projets Python (voir [pyproject.toml](pyproject.toml)) |
| **ogr2ogr** (gdal-bin sur debian/ubuntu)                      | Lecture des données WFS, GeoJSON, Shapefile, CSV,... et chargement en base PostgreSQL    |
| unzip                                                         | Extraction archive .zip                                                                  |
| 7z                                                            | Extraction archive .7z (p7zip-full sur debian/ubuntu)                                    |
| tar                                                           | Extraction archive .tar.gz, .tar.bz2                                                     |

### Installation des dépendances Python

```bash
git clone https://github.com/mborne/postgis-integration
cd postgis-integration
uv sync
```

### Paramètres

Les scripts s'appuient sur des variables d'environnements :

| Variable   | Description               | Valeur par défaut          | Obligatoire |
| ---------- | ------------------------- | -------------------------- | :---------: |
| PGHOST     | Nom du serveur            | localhost                  |     NON     |
| PGPORT     | Port du serveur           | 5432                       |     NON     |
| PGDATABASE | Nom de la base de données | `$USER`                    |     NON     |
| PGUSER     | Utilisateur               | `$USER`                    |     NON     |
| PGPASSWORD | Mot de passe utilisateur  | Aucune                     |     NON     |
| DATA_DIR   | Dossier de travail        | `postgis-integration/data` |     NON     |

### Création de la base de données

```bash
createdb gis
psql -d gis -c "CREATE EXTENSION postgis"
```

### Import de jeux de données

```bash
export PGDATABASE=gis
# import naturalearth
uv run datasets/naturalearth/import.py
# import adminexpress
uv run datasets/adminexpress/import.py
```

## Utilisation avec docker

```bash
docker build -t postgis-integration .
# avec docker-devbox/postgis et la configuration par défaut
docker run --rm -ti \
    --net=devbox -e PGHOST=postgis -e PGDATABASE=gis \
    -e PGUSER=postgres -e PGPASSWORD=ChangeIt \
    postgis-integration uv run datasets/naturalearth/import.py
```

## Utilisation avec Windows

Il est possible d'utiliser ogr2ogr.exe embarqué avec QGIS :

```powershell
$Env:PATH = "$Env:PATH;C:\Program Files\QGIS 3.36.3\bin"
$Env:GDAL_DATA = "C:\Program Files\QGIS 3.36.3\share\proj"

$Env:PGHOST = "localhost"
$Env:PGDATABASE = "gis"
$Env:PGUSER = "postgres"
$Env:PGPASSWORD = "ChangeIt"
$Env:PORT = "5432"

# importer les données adminexpress
uv run datasets/adminexpress/import.py
```

## Conventions

### Organisation des fichiers

Pour chaque jeu de données, on retrouve les fichiers suivant :

| Fichier                            | Description                       |
| ---------------------------------- | --------------------------------- |
| `datasets/{datasetName}`           | Dossier du jeu de données         |
| `datasets/{datasetName}/import.py` | Script d'import du jeu de données |

## License

[MIT](LICENSE)



