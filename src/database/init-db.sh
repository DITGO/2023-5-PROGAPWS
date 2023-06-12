#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
CREATE USER IF NOT EXISTS api_servidores;
ALTER USER api_servidores PASSWORD 'api_password';

CREATE DATABASE IF NOT EXISTS gap_project;
GRANT ALL PRIVILEGES ON DATABASE gap_project TO api_servidores;
EOSQL
