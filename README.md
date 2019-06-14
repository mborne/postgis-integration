# postgis-integration

**!!! Warning : Personal and experimental project to explore opendata resources, not ready for production !!!**

## Description

> This repository contains helpers to integrate data in postgis and dataset integration scripts mainly focused on open datasets about France.

Ce dépôt contient :

* Des [utilitaires permettant d'écrire facilement des scripts d'intégration](helper) (appel à ogr2ogr, psql, etc.)
* Des [scripts d'intégration de données ouvertes dans postgis](datasets)

## Jeux de données

**ATTENTION** : Reportez-vous aux descriptions des jeux de données pour connaître les conditions d'utilisation et licences exactes (voir `homepage` dans les fichiers `config.json` pour obtenir plus d'information)

| Nom                                                 | Description                                                                        |
| --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [adminexpress](./datasets/adminexpress/config.json) | Région, département, commune, etc. (IGN)                                           |
| [cadastre](./datasets/cadastre/config.json)         | Commune, section, feuille, parcelle, bâtiment (DGFIP retravaillé par ETALAB)       |
| [cog](./datasets/cog/config.json)                   | Communes existantes et ayant existés (INSEE)                                       |
| [dila](./datasets/dila/config.json)                 | Annuaire de l'administration (DILA)                                                |
| [geosirene](./datasets/geosirene/config.json)       | Base SIRENE géocodée de l'INSEE géocodée par cquest                                |
| [laposte](./datasets/laposte/config.json)           | Correspondance entre codes INSEE et codes postaux avec noms des communes (laposte) |
| [naturalearth](./datasets/naturalearth/config.json) | Jeux de données de couverture mondiale (Pays, ports, lacs, batymétrie, etc.)       |

## Usage

### Installation des composants systèmes

| Nom     | Description                                                                    |
| ------- | ------------------------------------------------------------------------------ |
| unzip   | Extraction archive .zip                                                        |
| 7z      | Extraction archive .7z (p7zip-full sur debian/ubuntu)                          |
| tar     | Extraction archive .tar.gz, .tar.bz2                                           |
| ogr2ogr | Lecture des formats geojson, shapefile, CSV, etc. (gdal-bin sur debian/ubuntu) |
| psql    | Chargement de données SQL (postgresql-client debian/ubuntu)                    |
| pg_dump | Génération d'export des données (postgresql-client debian/ubuntu)              |

### Installation de l'utilitaire

```bash
git clone https://github.com/mborne/postgis-integration
cd postgis-integration
npm install
```

### Paramètres

Les scripts s'appuient sur des variables d'environnements :

| Variable   | Description               | Valeur par défaut | Obligatoire |
| ---------- | ------------------------- | ----------------- | :---------: |
| PGHOST     | Nom du serveur            | localhost         |     NON     |
| PGDATABASE | Nom de la base de données | `$USER`           |     NON     |
| PGUSER     | Utilisateur               | `$USER`           |     NON     |
| PGPASSWORD | Mot de passe utilisateur  | Aucune            |     NON     |
| DATA_DIR   | Dossier de travail        | Aucune            |     OUI     |

### Création de la base de données

```bash
createdb gis
psql -d gis -c "CREATE EXTENSION postgis"
```

### Import de jeux de données

```bash
PGDATABASE=gis bin/import.js adminexpress
PGDATABASE=gis bin/import.js ban
#...
```

## Utilisation sous docker

```bash
docker build -t postgis-integration .
docker run -ti -e PGHOST=dbhost -e PGDATABASE=gis postgis-integration pgi-import adminexpress
...
```

## Conventions

### Organisation des fichiers

Pour chaque jeu de données, on retrouve les fichiers suivant :

| Fichier                            | Description                                   |
| ---------------------------------- | --------------------------------------------- |
| datasets/{datasetName}             | Dossier du jeu de données                     |
| datasets/{datasetName}/import.js   | Script d'import du jeu de données             |
| datasets/{datasetName}/config.json | Configuration du jeu de données (métadonnées) |

Le fichier `config.json` fournit les informations suivantes :

| Nom         | Description                                 | Exemple                                                                         |
| ----------- | ------------------------------------------- | ------------------------------------------------------------------------------- |
| name        | Identifiant du jeu de données               | ban                                                                             |
| description | Description du jeu de données en une phrase | Base Adresse Nationale                                                          |
| homepage    | Page de présentation du jeu de données      | https://www.data.gouv.fr/fr/datasets/ban-base-adresse-nationale/                |
| url         | URL de téléchargement du jeu de données     | https://adresse.data.gouv.fr/data/BAN_licence_gratuite_repartage_{CODE_DEP}.zip |
| version     | Version du jeu de données                   | latest                                                                          |

Remarque :

* `version=latest` traduit la possibilité pour le script de récupérer la dernière version du jeu de données
* l'URL peut contenir des paramètres évalués au niveau du script d'intégration (ex : `{CODE_DEP}`)

## License

[MIT](LICENSE)



