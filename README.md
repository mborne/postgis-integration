# postgis-integration

**!!! Warning : Personal and experimental project, not ready for production !!!**

> This repository contains helpers to integrate data in postgis and dataset integration scripts mainly focused on open datasets about France.

## Description

Ce dépôt contient :

* Des [utilitaires permettant d'écrire facilement des scripts d'intégration](helper) (appel à ogr2ogr, psql, etc.)
* Des [scripts d'intégration de données ouvertes dans postgis](datasets)

## Jeux de données

**ATTENTION** : Reportez-vous aux descriptions des jeux de données pour connaître les conditions d'utilisation et licences exactes (voir `homepage` dans les fichiers `config.json` pour obtenir plus d'information)

* [adminexpress](http://professionnels.ign.fr/adminexpress) : Région, département, commune, etc. (IGN) 
* [ban](https://www.data.gouv.fr/fr/datasets/ban-base-adresse-nationale/) : Base Adresse Nationale (DGFIP, IGN, OSM, laposte)
* [cadastre-etalab](https://cadastre.data.gouv.fr/datasets/cadastre-etalab) : Commune, section, feuille, parcelle, bâtiment (DGFIP retravaillé par ETALAB)
* [codes-postaux](https://datanova.laposte.fr/explore/dataset/laposte_hexasmal/) : Correspondance entre codes INSEE et codes postaux avec noms des communes (laposte)
* [cog-commune](https://www.insee.fr/fr/information/2666684#titre-bloc-3) : Communes existantes et ayant existés (INSEE)
* [geosirene](http://data.cquest.org/geo_sirene/) : Base SIRENE géocodée de l'INSEE géocodée par cquest
* [naturalearth](http://www.naturalearthdata.com/downloads/) : Jeux de données de couverture mondiale (Pays, ports, lacs, batymétrie, etc.)
* [service-public](https://www.data.gouv.fr/fr/datasets/service-public-fr-annuaire-de-l-administration-base-de-donnees-locales/) : Annuaire de l'administration (DILA)

## Usage

### Installation des composants systèmes

Pour l'extraction des archives :

* unzip
* 7z (p7zip-full sur debian/ubuntu)
* tar

Pour la manipulation des données :

* ogr2ogr (gdal-bin sur debian/ubuntu, version testée : GDAL 2.1.3, released 2017/20/01 de ppa:ubuntugis/ppa)
* psql (postgresql-client-* sur debian/ubuntu)


### Installation de l'utilitaire

```bash
git clone https://github.com/mborne/postgis-integration
cd postgis-integration
npm install
```

### Configuration de la connexion à la base de données

Les scripts s'appuient sur les variables d'environnements standards PostgreSQL :

* PGHOST : Nom du serveur
* PGDATABASE : Nom de la base de données
* PGUSER : Utilisateur
* PGPASSWORD : Mot de passe utilisateur


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
docker run -ti -e PGHOST=dbhost -e PGDATABASE=gis postgis-integration npm run postgis-import adminexpress
...
```

## Conventions

### Organisation des fichiers

Pour chaque jeu de données, on retrouve les fichiers suivant :

| Fichier                            | Description                                   |
|------------------------------------|-----------------------------------------------|
| datasets/{datasetName}             | Dossier du jeu de données                     |
| datasets/{datasetName}/import.js   | Script d'import du jeu de données             |
| datasets/{datasetName}/config.json | Configuration du jeu de données (métadonnées) |

Le fichier `config.json` fournit les informations suivantes :

| Nom         | Description                                 | Exemple                                                                         |
|-------------|---------------------------------------------|---------------------------------------------------------------------------------|
| name        | Identifiant du jeu de données               | ban                                                                             |
| description | Description du jeu de données en une phrase | Base Adresse Nationale                                                          |
| homepage    | Page de présentation du jeu de données      | https://www.data.gouv.fr/fr/datasets/ban-base-adresse-nationale/                |
| url         | URL de téléchargement du jeu de données     | https://adresse.data.gouv.fr/data/BAN_licence_gratuite_repartage_{CODE_DEP}.zip |
| version     | Version du jeu de données                   | latest                                                                          |

Remarque : 

* `version=latest` traduit la possibilité pour le script de récupérer la dernière version du jeu de données
* l'URL peut contenir des paramètres évalués au niveau du script d'intégration (ex : `{CODE_DEP}`)

## Licence

[MIT](LICENSE)



