import os
import patoolib
import shutil
import subprocess

from helpers.gdal import ogr2ogr_import_shp
from helpers.http import download
from helpers.storage import data_dir
import helpers.db as db

NATURALEARTH_URL="https://naciscdn.org/naturalearth/packages/natural_earth_vector.zip"
NATURALEARTH_PATH=os.path.join(data_dir(),'naturalearth.zip')
NATURALEARTH_DIR=os.path.join(data_dir(),'naturalearth')

def naturalearth_download():
    print(f'download {NATURALEARTH_PATH} ...')
    if os.path.exists(NATURALEARTH_PATH):
        print(f'download {NATURALEARTH_PATH} : skipped, already exists')
        return

    download(NATURALEARTH_URL, NATURALEARTH_PATH)


def naturalearth_extract():
    print(f'extract naturalearth.zip to ${NATURALEARTH_DIR} ...')

    if os.path.exists(NATURALEARTH_DIR):
        shutil.rmtree(NATURALEARTH_DIR)
    
    os.mkdir(NATURALEARTH_DIR)
    patoolib.extract_archive(NATURALEARTH_PATH,outdir=NATURALEARTH_DIR)


def naturalearth_import(shp_path):
    print(f'Import {shp_path} ...')
    ogr2ogr_import_shp(input_path=shp_path, schema_name="naturalearth", promote_to_multi=True)


def naturalearth_import_all():
    print('create naturalearth schema ...')
    db.db_create_schema("naturalearth")
    
    naturalearth_download()
    naturalearth_extract()

    print('find .shp files ...')
    for dirpath, dirnames, filenames in os.walk(NATURALEARTH_DIR):
        for filename in filenames:
            if not str(filename).endswith('.shp'):
                continue
            shp_path=os.path.join(dirpath, filename)
            naturalearth_import(shp_path)

if __name__ == '__main__':
    naturalearth_import_all()
