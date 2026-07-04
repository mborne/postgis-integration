import helpers.db as db
import yaml
import argparse
from pathlib import Path

from helpers.gdal import ogr2ogr_import_parquet

BDTOPO_PQT_URL="https://data.geopf.fr/chunk/telechargement/download/BDTOPO_PQT/BDTOPO_3-5_TOUSTHEMES_GEOPARQUET_WGS84G_FRA_2026-03-15/"
BDTOPO_SCHEMA="bdtopo_v3"

# Load themes from YAML
with open(Path(__file__).parent / "themes.yaml", "r", encoding="utf-8") as f:
    BDTOPO_THEMES = yaml.safe_load(f)

BDTOPO_THEME_NAMES = [theme.get("name") for theme in BDTOPO_THEMES]

def bdtopo_typenames(theme_name: str = None):
    """Get table names from themes. If theme_name is provided, return only tables from that theme."""
    if theme_name is None:
        # Return all table names
        return [table for theme in BDTOPO_THEMES for table in theme.get("tables", [])]
    else:
        # Return table names for specific theme
        for theme in BDTOPO_THEMES:
            if theme.get("name") == theme_name:
                return theme.get("tables", [])
        raise ValueError(f"Theme '{theme_name}' not found")

def bdtopo_import_table(typename):
    """Import a specific table"""
    print(f'Import {typename} ...')
    
    url = f"{BDTOPO_PQT_URL}/{typename}.parquet"
    ogr2ogr_import_parquet(
        url=url, 
        schema_name=BDTOPO_SCHEMA, 
        table_name=typename
    )

def bdtopo_import_all():
    """Import tables for all themes"""
    print(f'list types for {bdtopo_typenames()} ...')
    
    print('create bdtopo schema ...')
    db.db_create_schema(BDTOPO_SCHEMA)
    for typename in bdtopo_typenames():
        bdtopo_import_table(typename)


def bdtopo_import_theme(theme_name):
    """Import all tables for a specific theme"""
    print(f'Import theme {theme_name} ...')
    
    print('create bdtopo schema ...')
    db.db_create_schema(BDTOPO_SCHEMA, drop_if_exists=False)
    
    for typename in bdtopo_typenames(theme_name):
        bdtopo_import_table(typename)
    

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Import BDTopo data')
    parser.add_argument('--theme', type=str, help='Specific theme to import', choices=BDTOPO_THEME_NAMES, default=None)
    args = parser.parse_args()
    
    if args.theme:
        bdtopo_import_theme(args.theme)
    else:
        bdtopo_import_all()
