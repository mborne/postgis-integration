import os
import shutil
import subprocess
import sys

import yaml

import helpers.config as config
import helpers.db as db
from helpers.http import download
from helpers.storage import data_dir

DEFAULT_FLEX_STYLE = "generic.lua"
DEFAULT_CACHE_SIZE = 6000
DEFAULT_SCHEMA_PREFIX = "osm"


def _slugify(value: str) -> str:
    return "".join(c if c.isalnum() else "_" for c in value).strip("_").lower()


def _derive_prefix_from_url(url: str) -> str:
    filename = os.path.basename(url)
    if filename.endswith(".osm.pbf"):
        filename = filename[:-8]
    if filename.endswith("-latest"):
        filename = filename[:-7]
    return _slugify(filename) or "osm_import"


def _zones_file_path() -> str:
    return os.path.join(os.path.dirname(__file__), "zones.yaml")


def _load_zones() -> dict[str, dict]:
    with open(_zones_file_path(), encoding="utf-8") as handle:
        data = yaml.safe_load(handle)

    if not isinstance(data, dict):
        raise RuntimeError("Invalid zones.yaml: expected a map of zones")

    zones: dict[str, dict] = {}
    for zone_name, zone_config in data.items():
        if not isinstance(zone_name, str) or not isinstance(zone_config, dict):
            raise RuntimeError("Invalid zones.yaml: each zone must map to a configuration object")
        zones[zone_name.lower()] = zone_config

    return zones


def _get_zone_name() -> str:
    if len(sys.argv) < 2:
        available = ", ".join(sorted(_load_zones().keys()))
        raise RuntimeError(f"Missing zone argument. Usage: uv run datasets/osm/import.py <zone> (available: {available})")

    zone_name = sys.argv[1].strip().lower()
    if not zone_name:
        raise RuntimeError("Zone argument cannot be empty")

    return zone_name


def _get_zone_config(zone_name: str) -> dict:
    zones = _load_zones()
    zone_config = zones.get(zone_name)
    if not zone_config:
        available = ", ".join(sorted(zones.keys()))
        raise RuntimeError(f"Unknown zone '{zone_name}'. Available zones: {available}")
    return zone_config


def _resolve_settings(zone_name: str, zone_config: dict) -> dict:
    if "url" not in zone_config:
        raise RuntimeError(f"Missing 'url' for zone '{zone_name}' in zones.yaml")

    osm_planet_url = os.getenv("OSM_PLANET_URL", str(zone_config["url"]))
    osm_planet_filename = os.getenv("OSM_PLANET_FILENAME", os.path.basename(osm_planet_url))
    osm_planet_dir = os.path.join(data_dir(), "osm")
    if not os.path.exists(osm_planet_dir):
        os.mkdir(osm_planet_dir)    
    osm_path = os.path.join(osm_planet_dir, osm_planet_filename)

    default_prefix = str(zone_config.get("prefix") or _derive_prefix_from_url(osm_planet_url))
    default_schema = str(zone_config.get("schema") or f"{DEFAULT_SCHEMA_PREFIX}_{_slugify(zone_name)}")
    default_cache_size = str(zone_config.get("cache_size", DEFAULT_CACHE_SIZE))

    return {
        "zone": zone_name,
        "url": osm_planet_url,
        "path": osm_path,
        "prefix": os.getenv("OSM_PREFIX", default_prefix),
        "schema": os.getenv("OSM_SCHEMA", default_schema),
        "cache_size": int(os.getenv("CACHE_SIZE", default_cache_size)),
        "flex_style": os.getenv("OSM_FLEX_STYLE", DEFAULT_FLEX_STYLE),
    }


def _resolve_flex_style_path(osm2pgsql_path: str, flex_style: str) -> str:
    if os.path.isabs(flex_style):
        if os.path.isfile(flex_style):
            return flex_style
        raise RuntimeError(f"Flex style file not found: {flex_style}")

    flex_config_dir = os.path.join(os.path.dirname(osm2pgsql_path), "flex-config")
    style_path = os.path.join(flex_config_dir, flex_style)

    if not os.path.isfile(style_path):
        raise RuntimeError(f"Flex style not found: {style_path}")

    return style_path


def _build_osm2pgsql_command(osm2pgsql_path: str, settings: dict) -> list[str]:
    style_path = _resolve_flex_style_path(osm2pgsql_path, settings["flex_style"])

    command = [
        osm2pgsql_path,
        "--create",
        "--slim",
        "--output=flex",
        f"--style={style_path}",
        "--schema",
        settings["schema"],
        "--prefix",
        settings["prefix"],
    ]

    if config.PGHOST:
        command.extend(["--host", config.PGHOST])
    if config.PGPORT:
        command.extend(["--port", str(config.PGPORT)])
    if config.PGDATABASE:
        command.extend(["--database", config.PGDATABASE])
    if config.PGUSER:
        command.extend(["--username", config.PGUSER])

    command.append(settings["path"])
    return command


def _download(settings: dict):
    download(url=settings["url"], output_path=settings["path"])


def _import(settings: dict):
    osm2pgsql_path = shutil.which("osm2pgsql")
    if not osm2pgsql_path:
        raise RuntimeError("osm2pgsql command not found in PATH")

    command = _build_osm2pgsql_command(osm2pgsql_path, settings)
    print("run:", " ".join(command))

    env = config.os_env()
    env["CACHE_SIZE"] = str(settings["cache_size"])
    subprocess.run(command, check=True, env=env)


def import_zone(zone_name: str):
    zone_config = _get_zone_config(zone_name)
    settings = _resolve_settings(zone_name, zone_config)

    print(f"create {settings['schema']} schema for zone {settings['zone']} ...")
    db.db_create_schema(settings["schema"])

    _download(settings)
    _import(settings)


if __name__ == "__main__":
    import_zone(_get_zone_name())
