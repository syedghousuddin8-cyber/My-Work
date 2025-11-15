#!/bin/bash

# Server Setup Script for Admin Panel
# Run this script on the server after transferring files

set -e

echo "======================================"
echo "Server Setup for Admin Panel"
echo "======================================"
echo ""

# Update system packages
echo "Updating system packages..."
sudo apt-get update

# Install nginx
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    sudo apt-get install -y nginx
    echo "✓ Nginx installed"
else
    echo "✓ Nginx already installed"
fi

# Install Node.js 20.x
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✓ Node.js installed"
else
    NODE_VERSION=$(node -v)
    echo "✓ Node.js already installed ($NODE_VERSION)"
fi

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
    echo "✓ PM2 installed"
else
    echo "✓ PM2 already installed"
fi

# Install build essentials (may be needed for some npm packages)
if ! dpkg -l | grep -q build-essential; then
    echo "Installing build essentials..."
    sudo apt-get install -y build-essential
fi

# Create application directory structure
echo "Creating application directories..."
sudo mkdir -p /var/www/delivery-platform/admin-panel
sudo mkdir -p /var/www/delivery-platform/backend
sudo mkdir -p /var/log/delivery-platform

# Set proper ownership
sudo chown -R $USER:$USER /var/www/delivery-platform
sudo chown -R $USER:$USER /var/log/delivery-platform

echo "✓ Directories created"

# Configure firewall (if ufw is installed)
if command -v ufw &> /dev/null; then
    echo "Configuring firewall..."
    sudo ufw allow 22/tcp    # SSH
    sudo ufw allow 80/tcp    # HTTP
    sudo ufw allow 443/tcp   # HTTPS
    echo "✓ Firewall rules added"
fi

# Enable nginx to start on boot
echo "Enabling nginx service..."
sudo systemctl enable nginx

# Create PM2 startup script
echo "Setting up PM2 startup..."
pm2 startup systemd -u $USER --hp /home/$USER || true

echo ""
echo "======================================"
echo "Server setup completed successfully!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Extract admin panel build files to /var/www/delivery-platform/admin-panel"
echo "2. Configure nginx with the provided configuration"
echo "3. Restart nginx: sudo systemctl restart nginx"
echo ""
