#!/bin/bash
# 6amMart Server Preparation Script
# This script prepares an Ubuntu server for 6amMart deployment

set -e  # Exit on error

echo "========================================="
echo "6amMart Server Preparation"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Update system
echo -e "${GREEN}[1/10] Updating system packages...${NC}"
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y

# Install basic utilities
echo -e "${GREEN}[2/10] Installing basic utilities...${NC}"
sudo apt-get install -y \
    software-properties-common \
    curl \
    wget \
    git \
    unzip \
    zip \
    htop \
    vim \
    build-essential

# Install PHP 8.2 and extensions
echo -e "${GREEN}[3/10] Installing PHP 8.2 and required extensions...${NC}"
sudo add-apt-repository ppa:ondrej/php -y
sudo apt-get update
sudo apt-get install -y \
    php8.2 \
    php8.2-fpm \
    php8.2-cli \
    php8.2-common \
    php8.2-mysql \
    php8.2-mbstring \
    php8.2-xml \
    php8.2-curl \
    php8.2-zip \
    php8.2-gd \
    php8.2-bcmath \
    php8.2-intl \
    php8.2-simplexml \
    php8.2-json \
    php8.2-fileinfo \
    php8.2-tokenizer

# Verify PHP installation
php -v

# Install Composer
echo -e "${GREEN}[4/10] Installing Composer...${NC}"
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer
composer --version

# Install MySQL
echo -e "${GREEN}[5/10] Installing MySQL 8.0...${NC}"
sudo apt-get install -y mysql-server mysql-client
sudo systemctl start mysql
sudo systemctl enable mysql

# Install Nginx
echo -e "${GREEN}[6/10] Installing Nginx...${NC}"
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Node.js and npm (for asset compilation and Flutter web)
echo -e "${GREEN}[7/10] Installing Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v

# Install Flutter
echo -e "${GREEN}[8/10] Installing Flutter...${NC}"
cd /opt
sudo wget https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.35.6-stable.tar.xz
sudo tar xf flutter_linux_3.35.6-stable.tar.xz
sudo rm flutter_linux_3.35.6-stable.tar.xz

# Add Flutter to PATH (add to both root and ubuntu user)
echo 'export PATH="$PATH:/opt/flutter/bin"' | sudo tee -a /etc/profile
echo 'export PATH="$PATH:/opt/flutter/bin"' >> ~/.bashrc
export PATH="$PATH:/opt/flutter/bin"

# Pre-download Flutter SDK
flutter doctor
flutter config --enable-web

# Install Supervisor (for queue workers)
echo -e "${GREEN}[9/10] Installing Supervisor...${NC}"
sudo apt-get install -y supervisor
sudo systemctl start supervisor
sudo systemctl enable supervisor

# Install Redis (for caching and queues)
echo -e "${GREEN}[10/10] Installing Redis...${NC}"
sudo apt-get install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3306/tcp
sudo ufw --force enable

# Create application directory
echo -e "${GREEN}Creating application directories...${NC}"
sudo mkdir -p /var/www/6ammart
sudo chown -R $USER:$USER /var/www/6ammart

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Server preparation completed successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Installed software versions:"
echo "- PHP: $(php -v | head -n 1)"
echo "- Composer: $(composer --version)"
echo "- MySQL: $(mysql --version)"
echo "- Nginx: $(nginx -v 2>&1)"
echo "- Node.js: $(node -v)"
echo "- npm: $(npm -v)"
echo "- Flutter: $(flutter --version | head -n 1)"
echo ""
echo "Next steps:"
echo "1. Run the database setup script"
echo "2. Deploy the Laravel backend"
echo "3. Build and deploy the Flutter web app"
