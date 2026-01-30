import os
import patoolib
import shutil
import glob

from helpers.gdal import ogr2ogr_import_shp
from helpers.http import download
from helpers.storage import data_dir
import helpers.db as db

# https://geoservices.ign.fr/route500
ROUTE500_URL="https://files.opendatarchives.fr/professionnels.ign.fr/route500/ROUTE500_3-0__SHP_LAMB93_FXX_2019-10-30.7z"
ROUTE500_PATH=os.path.join(data_dir(),'route500.7z')
ROUTE500_DIR=os.path.join(data_dir(),'route500')

ROUTE500_TABLES = [
    "COMMUNICATION_RESTREINTE",
    "NOEUD_ROUTIER",
    "TRONCON_ROUTE"
]

def route500_download():
    download(url=ROUTE500_URL, output_path=ROUTE500_PATH)

def route500_extract():
    print(f'extract route500.7z to ${ROUTE500_DIR} ...')

    if os.path.exists(ROUTE500_DIR):
        shutil.rmtree(ROUTE500_DIR)
    
    os.mkdir(ROUTE500_DIR)
    patoolib.extract_archive(ROUTE500_PATH,outdir=ROUTE500_DIR)

def route500_import(table_name, shp_path):
    print(f'import {table_name} ...')
    ogr2ogr_import_shp(input_path=shp_path, schema_name="route500", promote_to_multi=False)

def route500_import_all():
    print('create route500 schema ...')
    db.db_create_schema("route500")
    
    route500_download()
    route500_extract()

    print('find .shp files ...')
    shp_files = glob.glob(os.path.join(ROUTE500_DIR, '**', '*.shp'), recursive=True)
    for shp_file in shp_files:
        table_name = os.path.splitext(os.path.basename(shp_file))[0]
        if not table_name in ROUTE500_TABLES:
            print(f'skip {table_name} ...')
            continue
        route500_import(table_name, shp_file)

if __name__ == '__main__':
    route500_import_all()
