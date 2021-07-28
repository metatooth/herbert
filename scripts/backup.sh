#!/bin/bash
# This script will backup a PostgreSQL database

# PARAMETERS
# $1 database name (if none specified will run pg_dumpall)

# CONSTANTS
DIR="/var/lib/postgresql/backups"
TS=$(date "+%Y%m%d-%H%M%S")

mkdir -p $DIR

if [ -z "$1" ]
then
pg_dumpall | gzip - > $DIR/pg_dumpall_$TS.sql.gz

else
pg_dump $1 | gzip - > $DIR/$1_$TS.sql.gz

fi
