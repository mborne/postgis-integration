import csv
import os
import sys

import helpers.db as db
from helpers.gdal import ogr2ogr_import_csv
from helpers.http import download
from helpers.storage import data_dir
from shapely import from_geojson

CODES_POSTAUX_URL = os.getenv(
	"CODES_POSTAUX_URL",
	"https://data.laposte.fr/data-fair/api/v1/datasets/laposte-hexasmal/data-files/019HexaSmal-full.csv",
)
CODES_POSTAUX_SCHEMA = os.getenv("CODES_POSTAUX_SCHEMA", "codes_postaux")
CODES_POSTAUX_TABLE = os.getenv("CODES_POSTAUX_TABLE", "codes_postaux")

SOURCE_COLUMNS = [
	"Code_commune_INSEE",
	"Nom_de_la_commune",
	"Code_postal",
	"Libellé_d_acheminement",
	"Ligne_5",
	"_contours_commune.geometry",
]

TARGET_COLUMNS = {
	"Code_commune_INSEE": "code_commune_insee",
	"Nom_de_la_commune": "nom_de_la_commune",
	"Code_postal": "code_postal",
	"Libellé_d_acheminement": "libelle_d_acheminement",
	"Ligne_5": "ligne_5",
	"_contours_commune.geometry": "geom_wkt",
}


def _codes_postaux_dir() -> str:
	path = os.path.join(data_dir(), "codes_postaux")
	if not os.path.exists(path):
		os.mkdir(path)
	return path


def _source_csv_path() -> str:
	return os.path.join(_codes_postaux_dir(), os.path.basename(CODES_POSTAUX_URL))


def _normalized_csv_path() -> str:
	return os.path.join(_codes_postaux_dir(), "codes_postaux.csv")


def _normalize_header(value: str) -> str:
	return value.strip().lstrip("#")


def _csv_dialect(source_handle) -> csv.Dialect:
	sample = source_handle.read(4096)
	source_handle.seek(0)
	try:
		return csv.Sniffer().sniff(sample, delimiters=",;")
	except csv.Error:
		return csv.excel


def _geojson_geometry_to_wkt(value: str) -> str:
	if not value or not value.strip():
		return ""
	return from_geojson(value).wkt


def _normalize_source_csv(source_path: str, output_path: str):
	csv.field_size_limit(sys.maxsize)
	with open(source_path, encoding="utf-8-sig", newline="") as source_handle:
		reader = csv.reader(source_handle, dialect=_csv_dialect(source_handle))
		source_headers = next(reader)
		header_positions = {
			_normalize_header(name): index
			for index, name in enumerate(source_headers)
		}

		missing_columns = [name for name in SOURCE_COLUMNS if name not in header_positions]
		if missing_columns:
			raise RuntimeError(f"Missing columns in source CSV: {', '.join(missing_columns)}")

		with open(output_path, "w", encoding="utf-8", newline="") as output_handle:
			writer = csv.writer(output_handle)
			writer.writerow([TARGET_COLUMNS[name] for name in SOURCE_COLUMNS])

			for row in reader:
				normalized_row = []
				for name in SOURCE_COLUMNS:
					value = row[header_positions[name]]
					if name == "_contours_commune.geometry":
						value = _geojson_geometry_to_wkt(value)
					normalized_row.append(value)
				writer.writerow(normalized_row)


def codes_postaux_download():
	download(CODES_POSTAUX_URL, _source_csv_path())


def codes_postaux_prepare():
	print(f"normalize {_source_csv_path()} -> {_normalized_csv_path()} ...")
	_normalize_source_csv(_source_csv_path(), _normalized_csv_path())


def codes_postaux_import():
	input_path = _normalized_csv_path()

	print(f"Import {input_path} -> {CODES_POSTAUX_SCHEMA}.{CODES_POSTAUX_TABLE} ...")
	ogr2ogr_import_csv(
		input_path=input_path,
		schema_name=CODES_POSTAUX_SCHEMA,
		table_name=CODES_POSTAUX_TABLE,
		geom_possible_names="geom_wkt",
		source_srs="EPSG:4326",
		target_srs="EPSG:4326",
	)


def codes_postaux_import_all():
	print(f"create {CODES_POSTAUX_SCHEMA} schema ...")
	db.db_create_schema(CODES_POSTAUX_SCHEMA)

	codes_postaux_download()
	codes_postaux_prepare()
	codes_postaux_import()


if __name__ == "__main__":
	codes_postaux_import_all()
