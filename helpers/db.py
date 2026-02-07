import psycopg2

import helpers.config as config
from psycopg2.extras import RealDictCursor
import json

def db_connect():
    """Connect to database"""
    return psycopg2.connect(
        host= config.PGHOST,
        port = config.PGPORT,
        database = config.PGDATABASE,
        user = config.PGUSER, 
        password = config.PGPASSWORD,
    )

def db_create_schema(schema_name: str):
    """Create schema in the database"""
    with db_connect() as conn:
        with conn.cursor() as cur:
            cur.execute(f'DROP SCHEMA IF EXISTS "{schema_name}" CASCADE')
            cur.execute(f'CREATE SCHEMA "{schema_name}"')


def db_stats():
    sql = """
        SELECT
            oid,
            table_schema,
            table_name,
            row_estimate,
            total_bytes,
            index_bytes,
            toast_bytes,
            total_bytes - index_bytes-COALESCE(toast_bytes,0) AS table_bytes 
        FROM (
            SELECT c.oid,nspname AS table_schema, relname AS TABLE_NAME
                    , c.reltuples AS row_estimate
                    , pg_total_relation_size(c.oid) AS total_bytes
                    , pg_indexes_size(c.oid) AS index_bytes
                    , pg_total_relation_size(reltoastrelid) AS toast_bytes
                FROM pg_class c
                LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
                WHERE relkind = 'r'
        ) a
        WHERE table_schema NOT IN ('pg_catalog','information_schema')
        ORDER BY total_bytes DESC
    """

    with db_connect() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql)
            return cur.fetchall()


if __name__ == '__main__':
    for item in db_stats():
        print(json.dumps(item))

