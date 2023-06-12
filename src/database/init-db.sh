#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
  CREATE USER api_servidores;
  ALTER USER api_servidores PASSWORD 'api_password';

  SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = 'gap_project');
EOSQL

exists=$(psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" --tuples-only --no-align --command "SELECT bool_and(exists) FROM (SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = 'gap_project')) AS exists;")
if [ "$exists" = "f" ]; then
    psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
        CREATE DATABASE gap_project;
        GRANT ALL PRIVILEGES ON DATABASE gap_project TO api_servidores;
    EOSQL
fi
