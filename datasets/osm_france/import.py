import os
import shutil
import subprocess

import helpers.config as config
import helpers.db as db
from helpers.http import download
from helpers.storage import data_dir

OSM_FRANCE_SCHEMA = "osm_france"
OSM_FRANCE_PREFIX = "osm_france"
OSM_FRANCE_URL = "https://download.geofabrik.de/europe/france-latest.osm.pbf"
OSM_FRANCE_PATH = os.path.join(data_dir(), "france-latest.osm.pbf")
OSM_FRANCE_FLEX_STYLE = os.getenv("OSM_FRANCE_FLEX_STYLE", "generic.lua")
OSM_FRANCE_CACHE_SIZE = int(os.getenv("OSM_FRANCE_CACHE_SIZE", "6000"))

def osm_france_download():
    download(url=OSM_FRANCE_URL, output_path=OSM_FRANCE_PATH)


def _resolve_flex_style_path(osm2pgsql_path: str) -> str:
    if os.path.isabs(OSM_FRANCE_FLEX_STYLE):
        if os.path.isfile(OSM_FRANCE_FLEX_STYLE):
            return OSM_FRANCE_FLEX_STYLE
        raise RuntimeError(f"Flex style file not found: {OSM_FRANCE_FLEX_STYLE}")

    flex_config_dir = os.path.join(os.path.dirname(osm2pgsql_path), "flex-config")
    style_path = os.path.join(flex_config_dir, OSM_FRANCE_FLEX_STYLE)
    
    if not os.path.isfile(style_path):
        raise RuntimeError(f"Flex style not found: {style_path}")
    
    return style_path


def _build_osm2pgsql_command(osm2pgsql_path: str) -> list[str]:
    style_path = _resolve_flex_style_path(osm2pgsql_path)

    command = [
        osm2pgsql_path,
        "--create",
        "--slim",
        "--hstore",
        "--output=flex",
        f"--style={style_path}",
        "--schema",
        OSM_FRANCE_SCHEMA,
        "--prefix",
        OSM_FRANCE_PREFIX,
    ]

    if config.PGHOST:
        command.extend(["--host", config.PGHOST])
    if config.PGPORT:
        command.extend(["--port", str(config.PGPORT)])
    if config.PGDATABASE:
        command.extend(["--database", config.PGDATABASE])
    if config.PGUSER:
        command.extend(["--username", config.PGUSER])

    command.append(OSM_FRANCE_PATH)
    return command


def osm_france_import():
    osm2pgsql_path = shutil.which("osm2pgsql")
    if not osm2pgsql_path:
        raise RuntimeError("osm2pgsql command not found in PATH")

    command = _build_osm2pgsql_command(osm2pgsql_path)
    print("run:", " ".join(command))
    env = config.os_env()
    env["CACHE_SIZE"] = str(OSM_FRANCE_CACHE_SIZE)
    subprocess.run(command, check=True, env=env)


def osm_france_import_all():
    print(f"create {OSM_FRANCE_SCHEMA} schema ...")
    db.db_create_schema(OSM_FRANCE_SCHEMA)

    osm_france_download()
    osm_france_import()


if __name__ == '__main__':
    osm_france_import_all()

