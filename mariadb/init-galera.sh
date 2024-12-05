#!/bin/bash

# Replace placeholders in the configuration template
sed "s/CLUSTER_NAME_PLACEHOLDER/$MARIADB_GALERA_CLUSTER_NAME/g" \
    -e "s|CLUSTER_ADDRESS_PLACEHOLDER|$MARIADB_GALERA_CLUSTER_ADDRESS|g" \
    -e "s/NODE_NAME_PLACEHOLDER/$MARIADB_GALERA_NODE_NAME/g" \
    -e "s/NODE_ADDRESS_PLACEHOLDER/$MARIADB_GALERA_NODE_ADDRESS/g" \
    /etc/mysql/conf.d/galera.cnf.template > /etc/mysql/conf.d/galera.cnf