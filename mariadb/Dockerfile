# Use the official MariaDB image as base
FROM mariadb:latest

# Install required packages
RUN apt-get update && apt-get install -y \
    rsync \
    mariadb-backup \
    socat \
    && rm -rf /var/lib/apt/lists/*

# Copy configuration template and initialization script
COPY galera.cnf.template /etc/mysql/conf.d/
COPY init-galera.sh /docker-entrypoint-initdb.d/

# Make sure the files have correct permissions
RUN chmod 644 /etc/mysql/conf.d/galera.cnf.template \
    && chmod 755 /docker-entrypoint-initdb.d/init-galera.sh

# Create directory for Galera cache
RUN mkdir -p /var/lib/mysql/galera-cache \
    && chown mysql:mysql /var/lib/mysql/galera-cache

# Set working directory
WORKDIR /var/lib/mysql