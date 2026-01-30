import helpers.db as db

from helpers.gdal import ogr2ogr_import_wfs

from owslib.wfs import WebFeatureService

GPF_WFS_URL="https://data.geopf.fr/wfs/ows"
ADMINEXPRESS_NAMESPACE="ADMINEXPRESS-COG.LATEST"

def adminexpress_list_types() -> list[str]:
    """list all types for ADMINEXPRESS_NAMESPACE"""

    wfs = WebFeatureService(url='https://data.geopf.fr/wfs', version='2.0.0')
    
    adminexpress_types = [x for x in wfs.contents if x.startswith(ADMINEXPRESS_NAMESPACE+":")]
    adminexpress_types.sort()
    return adminexpress_types


def adminexpress_import(typename):
    print(f'Import {typename} ...')
    
    typename_parts = typename.split(':')
    table_name = typename_parts[1]
    
    ogr2ogr_import_wfs(
        wfs_url=GPF_WFS_URL, 
        wfs_typename=typename,
        schema_name="adminexpress", 
        table_name=table_name
    )

def adminexpress_import_all():
    print(f'list types for {ADMINEXPRESS_NAMESPACE} ...')
    ADMINEXPRESS_TYPES = adminexpress_list_types()
    
    print('create adminexpress schema ...')
    db.db_create_schema("adminexpress")
    for typename in ADMINEXPRESS_TYPES:
        adminexpress_import(typename)

if __name__ == '__main__':
    adminexpress_import_all()
