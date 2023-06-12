#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
    CREATE USER api_servidores;
    ALTER USER api_servidores PASSWORD 'api_password';
EOSQL

database_exists=$(psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='gap_project'")

if [ "$database_exists" != "1" ]; then
    createdb -U postgres -O api_servidores gap_project
fi


# #!/bin/bash
# set -e

# psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
# 	CREATE USER api_servidores;
#     ALTER USER api_servidores PASSWORD 'api_password';
# 	CREATE DATABASE gap_project;
# 	GRANT ALL PRIVILEGES ON DATABASE gap_project TO api_servidores;
# EOSQL

