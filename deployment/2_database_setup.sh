#!/bin/bash
# 6amMart Database Setup Script

set -e  # Exit on error

echo "========================================="
echo "6amMart Database Setup"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Database configuration
DB_NAME="6ammart_db"
DB_USER="6ammart_user"
DB_PASSWORD=$(openssl rand -base64 32)  # Generate random password

echo -e "${YELLOW}Please enter MySQL root password when prompted${NC}"
echo ""

# Create database
echo -e "${GREEN}[1/4] Creating database: $DB_NAME${NC}"
sudo mysql -u root -p <<MYSQL_SCRIPT
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
MYSQL_SCRIPT

# Create database user
echo -e "${GREEN}[2/4] Creating database user: $DB_USER${NC}"
sudo mysql -u root -p <<MYSQL_SCRIPT
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SCRIPT

# Optimize MySQL for production
echo -e "${GREEN}[3/4] Optimizing MySQL configuration...${NC}"
sudo tee /etc/mysql/mysql.conf.d/6ammart.cnf > /dev/null <<EOF
[mysqld]
# Performance Settings
max_connections = 500
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Character set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Query cache (for MySQL 5.7, disabled in 8.0+)
# query_cache_type = 1
# query_cache_size = 128M

# Logging
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 2
EOF

# Restart MySQL
echo -e "${GREEN}[4/4] Restarting MySQL...${NC}"
sudo systemctl restart mysql

# Save database credentials
CRED_FILE="/var/www/6ammart/db_credentials.txt"
sudo mkdir -p /var/www/6ammart
sudo tee $CRED_FILE > /dev/null <<EOF
========================================
6amMart Database Credentials
========================================
Database Name: $DB_NAME
Database User: $DB_USER
Database Password: $DB_PASSWORD
Database Host: localhost
Database Port: 3306
========================================

IMPORTANT: Save these credentials securely!
You will need them for the Laravel .env file.

For .env file:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=$DB_NAME
DB_USERNAME=$DB_USER
DB_PASSWORD=$DB_PASSWORD
========================================
EOF

sudo chmod 600 $CRED_FILE

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Database setup completed successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${YELLOW}Database credentials have been saved to:${NC}"
echo -e "${YELLOW}$CRED_FILE${NC}"
echo ""
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo "Database Password: $DB_PASSWORD"
echo ""
echo -e "${RED}IMPORTANT: Save these credentials securely!${NC}"
echo ""
echo "Next step: Deploy Laravel backend using script 3_deploy_backend.sh"
