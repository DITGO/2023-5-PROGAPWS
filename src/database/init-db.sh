#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'api_servidores') THEN
        CREATE USER api_servidores;
        ALTER USER api_servidores PASSWORD 'api_password';
    END IF;

    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gap_project') THEN
        CREATE DATABASE gap_project;
        GRANT ALL PRIVILEGES ON DATABASE gap_project TO api_servidores;
    END IF;
END $$;

EOSQL
