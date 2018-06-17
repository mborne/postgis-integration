# postgis-integration

**!!! Warning : Personal and experimental project, not yet licensed and not ready for production !!!**

> This repository contains helpers to integrate data in postgis and dataset integration scripts mainly focused on open datasets about France.

## Description

Ce dépôt contient :

* Des [utilitaires permettant d'écrire facilement des scripts d'intégration](helper) (appel à ogr2ogr, psql, etc.)
* Des [scripts d'intégration de données ouvertes dans postgis](datasets)

## Jeux de données

**ATTENTION** : Reportez-vous aux descriptions des jeux de données pour connaître les conditions d'utilisation et licenses exactes (voir `homepage` dans les fichiers `config.json` pour obtenir plus d'information)

* [adminexpress](http://professionnels.ign.fr/adminexpress) : Région, département, commune, etc. (IGN) 
* [ban](https://www.data.gouv.fr/fr/datasets/ban-base-adresse-nationale/) : Base Adresse Nationale (DGFIP, IGN, OSM, laposte)
* [cadastre-etalab](https://cadastre.data.gouv.fr/datasets/cadastre-etalab) : Commune, section, feuille, parcelle, bâtiment (DGFIP retravaillé par ETALAB)
* [codes-postaux](https://datanova.laposte.fr/explore/dataset/laposte_hexasmal/) : Correspondance entre codes INSEE et codes postaux avec noms des communes (laposte)
* [cog-commune](https://www.insee.fr/fr/information/2666684#titre-bloc-3) : Communes existantes et ayant existés (INSEE)
* [geosirene](http://data.cquest.org/geo_sirene/) : Base SIRENE géocodée de l'INSEE géocodée par cquest
* [naturalearth](http://www.naturalearthdata.com/downloads/) : Pays, ports, lacs, batymétrie, etc. (domaine public)
* [service-public](https://www.data.gouv.fr/fr/datasets/service-public-fr-annuaire-de-l-administration-base-de-donnees-locales/) : Annuaire de l'administration (DILA)

## Usage

### Installation

```bash
cd postgis-integration
npm install
```

### Configuration de la connexion à la base de données

Les scripts s'appuient sur les variables d'environnements standards PostgreSQL :

* PGHOST : Nom du serveur
* PGDATABASE : Nom de la base de données
* PGUSER : Utilisateur
* PGPASSWORD : Mot de passe utilisateur


### Création de la base de données

```bash
createdb gis
psql -d gis -c "CREATE EXTENSION postgis"
```

### Import de jeux de données

```bash
PGDATABASE=gis npm run postgis-import adminexpress
PGDATABASE=gis npm run postgis-import ban
#...
```

## Conventions

### Organisation des fichiers

Pour chaque jeu de données, on a :

* Un dossier : `datasets/{datasetName}`
* Un fichier de configuration : `datasets/{datasetName}/config.js`
* Un script d'import : `datasets/{datasetName}/import.js`

Le fichier `config.js` fournit :

* Le lien vers la page décrivant le jeu de données (`homepage`)
* L'URL du service de téléchargement (`url`)
* La version intégrée (`version`)


Remarque : 

* `version=latest` traduit la possibilité pour le script de récupérer la dernière version du jeu de données
* l'URL peut contenir des paramètres évalués au niveau du script d'intégration (ex : `{CODE_DEP}`)

## Licence

[MIT](LICENSE)


## TODO

* [ ] Utilitaire de décompression `helper/extract.js`
* [ ] Générer la documentation des jeux de données à partir des configurations pour gh-pages
* [ ] Faire en sorte d'être en mesure de connaître la version importées pour les URL latest









