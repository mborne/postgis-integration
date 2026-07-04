# BDTopo

Script de chargement des données BDTopo au format parquet en base de données PostgreSQL (voir [cartes.gouv.fr - Testez les données BD TOPO® et Admin Express COG aux formats FlatGeobuf et GeoParquet](https://cartes.gouv.fr/aide/fr/partenaires/ign/generalites-ign/actualites/2026-06-flatgeobuf-geoparquet/))

## Utilisation

```bash
# affiche l'aide et les thèmes disponibles
uv run python -m datasets.bdtopo.import --help

# charger les tables du thème administratif dans le schema bdtopo_v3
uv run python -m datasets.bdtopo.import --theme administratif

# charger tous les thèmes
uv run python -m datasets.bdtopo.import
```

## Notes

```bash
# Pour lister les ressources au niveau du service de téléchargement
curl -H "Accept: application/json" -sS "https://data.geopf.fr/chunk/telechargement/resource/BDTOPO_PQT/BDTOPO_3-5_TOUSTHEMES_GEOPARQUET_WGS84G_FRA_2026-03-15?page=1&limit=100" | jq -r '.entry[].id'
```

## Ressources

- [cartes.gouv.fr - BD TOPO®](https://cartes.gouv.fr/rechercher-une-donnee/dataset/IGNF_BD-TOPO)
- [cartes.gouv.fr - Testez les données BD TOPO® et Admin Express COG aux formats FlatGeobuf et GeoParquet](https://cartes.gouv.fr/aide/fr/partenaires/ign/generalites-ign/actualites/2026-06-flatgeobuf-geoparquet/)
- Exemple URL parquet : https://data.geopf.fr/chunk/telechargement/download/BDTOPO_PQT/BDTOPO_3-5_TOUSTHEMES_GEOPARQUET_WGS84G_FRA_2026-03-15/departement.parquet
