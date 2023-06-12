# #!/bin/bash
# set -e

# psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
# 	CREATE USER api_servidores;
#     ALTER USER api_servidores PASSWORD 'api_password';
# 	CREATE DATABASE gap_project;
# 	GRANT ALL PRIVILEGES ON DATABASE gap_project TO api_servidores;
# EOSQL


#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
    CREATE USER IF NOT EXISTS api_servidores;
    ALTER USER api_servidores PASSWORD 'api_password';

    -- Verifica se o banco de dados já existe
    \c gap_project
    SELECT 1 FROM pg_database WHERE datname = 'gap_project' LIMIT 1;

    -- Se o banco de dados não existir, cria-o e concede privilégios
    \ifcode == 0
    CREATE DATABASE gap_project;
    GRANT ALL PRIVILEGES ON DATABASE gap_project TO api_servidores;
    \endif
EOSQL
