#!/bin/bash
# 6amMart Laravel Backend Deployment Script

set -e  # Exit on error

echo "========================================="
echo "6amMart Laravel Backend Deployment"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/6ammart"
BACKEND_DIR="$APP_DIR/backend"
REPO_URL="https://github.com/syedghousuddin8-cyber/6am.git"
ZIP_PASSWORD="VAg7mMXn9Z"

# Clone repository
echo -e "${GREEN}[1/12] Cloning 6amMart repository...${NC}"
cd /tmp
if [ -d "6am" ]; then
    rm -rf 6am
fi
git clone $REPO_URL
cd 6am

# Extract the admin panel
echo -e "${GREEN}[2/12] Extracting admin panel files...${NC}"
cd "6mamart-3.4-Momux-in-Mehedi/Main-6ammart-3.4-Momux/Main/Admin panel new install V3.4-nf/Admin panel new install V3.4-nf"

# Copy to deployment directory
echo -e "${GREEN}[3/12] Copying files to $BACKEND_DIR...${NC}"
sudo mkdir -p $BACKEND_DIR
sudo cp -r ./* $BACKEND_DIR/
sudo chown -R www-data:www-data $BACKEND_DIR

# Set proper permissions
echo -e "${GREEN}[4/12] Setting file permissions...${NC}"
cd $BACKEND_DIR
sudo find . -type f -exec chmod 644 {} \;
sudo find . -type d -exec chmod 755 {} \;
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache

# Install Composer dependencies
echo -e "${GREEN}[5/12] Installing Composer dependencies...${NC}"
cd $BACKEND_DIR
sudo -u www-data composer install --no-dev --optimize-autoloader --no-interaction

# Create environment file
echo -e "${GREEN}[6/12] Creating environment file...${NC}"
if [ ! -f .env ]; then
    sudo cp .env.example .env
fi

# Read database credentials
if [ -f "/var/www/6ammart/db_credentials.txt" ]; then
    DB_NAME=$(grep "Database Name:" /var/www/6ammart/db_credentials.txt | awk '{print $3}')
    DB_USER=$(grep "Database User:" /var/www/6ammart/db_credentials.txt | awk '{print $3}')
    DB_PASSWORD=$(grep "Database Password:" /var/www/6ammart/db_credentials.txt | awk '{print $3}')
else
    echo -e "${RED}Database credentials not found! Please run 2_database_setup.sh first.${NC}"
    exit 1
fi

# Configure .env file
echo -e "${GREEN}[7/12] Configuring environment variables...${NC}"
sudo sed -i "s/^DB_DATABASE=.*/DB_DATABASE=$DB_NAME/" .env
sudo sed -i "s/^DB_USERNAME=.*/DB_USERNAME=$DB_USER/" .env
sudo sed -i "s/^DB_PASSWORD=.*/DB_PASSWORD=$DB_PASSWORD/" .env
sudo sed -i "s/^DB_HOST=.*/DB_HOST=127.0.0.1/" .env
sudo sed -i "s/^DB_PORT=.*/DB_PORT=3306/" .env

# Generate application key
echo -e "${GREEN}[8/12] Generating application key...${NC}"
sudo -u www-data php artisan key:generate --force

# Clear and cache configuration
echo -e "${GREEN}[9/12] Clearing and caching configuration...${NC}"
sudo -u www-data php artisan config:clear
sudo -u www-data php artisan cache:clear
sudo -u www-data php artisan route:clear
sudo -u www-data php artisan view:clear

# Run database migrations
echo -e "${GREEN}[10/12] Running database migrations...${NC}"
sudo -u www-data php artisan migrate --force

# Seed database (if needed)
echo -e "${YELLOW}[11/12] Do you want to seed the database? (y/n)${NC}"
read -p "Seed database? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo -u www-data php artisan db:seed --force
fi

# Optimize Laravel
echo -e "${GREEN}[12/12] Optimizing Laravel...${NC}"
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
sudo -u www-data php artisan view:cache

# Create symbolic link for storage
if [ ! -L "$BACKEND_DIR/public/storage" ]; then
    sudo -u www-data php artisan storage:link
fi

# Set final permissions
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache public/storage

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Laravel backend deployed successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Backend directory: $BACKEND_DIR"
echo "Database: $DB_NAME"
echo ""
echo "Next steps:"
echo "1. Configure Nginx (script 5_configure_nginx.sh)"
echo "2. Deploy Flutter web app (script 4_deploy_flutter.sh)"
echo "3. Set up SSL certificate"
echo ""
echo "To test the backend, run:"
echo "  cd $BACKEND_DIR && php artisan serve"
