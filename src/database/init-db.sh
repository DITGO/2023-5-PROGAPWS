#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
  CREATE USER api_servidores;
  ALTER USER api_servidores PASSWORD 'api_password';

  SELECT datname FROM pg_database WHERE datname = 'gap_project' LIMIT 1;
  \gset
  \if :result
    SELECT 'Database gap_project already exists.';
  \else
    CREATE DATABASE gap_project;
