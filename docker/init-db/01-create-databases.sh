#!/bin/bash
set -e

# Create both databases (connect to default 'postgres' db to run CREATE DATABASE)
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
    CREATE DATABASE jungle_admin_dev;
    CREATE DATABASE jungle_admin_test;
EOSQL

# Seed both databases from the same dump file
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname jungle_admin_dev -f /docker-entrypoint-initdb.d/02-seed.sql
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname jungle_admin_test -f /docker-entrypoint-initdb.d/02-seed.sql
