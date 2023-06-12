#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
 CREATE USER api_servidores;
  ALTER USER api_servidores PASSWORD 'api_password';
SELECT datname FROM pg_catalog.pg_database WHERE datname = 'gap_project';

DO
BEGIN
    IF NOT EXISTS (SELECT datname FROM pg_catalog.pg_database WHERE datname = 'gap_project') THEN
        CREATE DATABASE gap_project;
        GRANT ALL PRIVILEGES ON DATABASE gap_project TO api_servidores;
    END IF;
END;

EOSQL
