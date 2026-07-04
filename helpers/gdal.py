import shutil
import subprocess

import helpers.config as config

class Ogr2ogrNotFound(RuntimeError): ...

def ogr2ogr_path() -> str:
    path = shutil.which("ogr2ogr")
    if not path:
        raise Ogr2ogrNotFound("ogr2ogr not found")
    return path

def ogr2ogr_version() -> str:
    return subprocess.run([ogr2ogr_path(), "--version"], capture_output=True).stdout.decode("utf-8")


def ogr2ogr_import_shp(
    input_path: str,
    schema_name: str,
    promote_to_multi: bool = False
):
    command = [ogr2ogr_path(), 
        '-f', 'PostgreSQL',
        "-lco", "GEOMETRY_NAME=geom",
        "-lco", "PRECISION=NO",
    ]

    if promote_to_multi:
        command.extend(["-nlt", "PROMOTE_TO_MULTI"]);

    command.extend([
        f"PG:schemas={schema_name}",
        input_path,
        "-overwrite"
    ])

    subprocess.run(command, env=config.os_env(), capture_output=False)


def ogr2ogr_import_wfs(
    wfs_url: str,
    wfs_typename: str,
    schema_name: str,
    table_name: str,
):
    subprocess.run([ogr2ogr_path(), 
        '-f', 'PostgreSQL',
        "-lco", "GEOMETRY_NAME=geom",
        "-lco", f"SCHEMA={schema_name}",
        "-nln", table_name, "-doo", f"ACTIVE_SCHEMA={schema_name}",
        "PG:",
        f'WFS:{wfs_url}',
        wfs_typename,
        "-overwrite"
    ], env=config.os_env(), capture_output=True)


def ogr2ogr_import_parquet(
    url: str,
    schema_name: str,
    table_name: str,
):
    process_env = config.os_env()
    process_env["PG_USE_COPY"] = "YES"
    subprocess.run([ogr2ogr_path(), 
        '-f', 'PostgreSQL',
        "-lco", "GEOMETRY_NAME=geom",
        "-lco", f"SCHEMA={schema_name}",
        "-nln", table_name, "-doo", f"ACTIVE_SCHEMA={schema_name}",
        "PG:",
        f'/vsicurl/{url}',
        table_name,
        "-overwrite",
        "-progress"
    ], env=process_env, capture_output=True)

if __name__ == "__main__":
    try:
        print(ogr2ogr_version())
    except Exception as e:
        print(f'Error: {str(e)}')


