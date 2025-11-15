#!/bin/bash

# Deployment script for Admin Panel
# Usage: ./deploy-admin-panel.sh

set -e

# Configuration
SERVER_IP="52.66.71.133"
SERVER_USER="ubuntu"
SSH_KEY="~/.ssh/deploy_key"
REMOTE_DIR="/var/www/delivery-platform"
APP_NAME="admin-panel"
DOMAIN="admin.delivery-platform.com"  # Update with your domain
PORT=3000

echo "======================================"
echo "Admin Panel Deployment Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    print_error "SSH key not found at $SSH_KEY"
    echo "Please save the provided SSH key to $SSH_KEY and set permissions:"
    echo "  chmod 600 $SSH_KEY"
    exit 1
fi

print_info "Starting deployment process..."

# Step 1: Build the admin panel locally
print_info "Building admin panel for production..."
cd "$(dirname "$0")/../../admin-dashboard"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm install
fi

# Create production .env file if it doesn't exist
if [ ! -f ".env.production" ]; then
    print_info "Creating production environment file..."
    cat > .env.production << 'EOF'
REACT_APP_API_URL=http://52.66.71.133/api/v1
REACT_APP_WS_URL=ws://52.66.71.133/ws
REACT_APP_ENV=production
EOF
fi

# Build the application
print_info "Building React application..."
npm run build

if [ ! -d "build" ]; then
    print_error "Build failed - build directory not found"
    exit 1
fi

print_success "Build completed successfully"

# Step 2: Create deployment archive
print_info "Creating deployment archive..."
cd build
tar -czf ../admin-panel-build.tar.gz .
cd ..
print_success "Archive created"

# Step 3: Transfer files to server
print_info "Transferring files to server..."
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no admin-panel-build.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# Transfer deployment scripts
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no "$(dirname "$0")/server-setup.sh" $SERVER_USER@$SERVER_IP:/tmp/
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no "$(dirname "$0")/nginx-admin.conf" $SERVER_USER@$SERVER_IP:/tmp/

print_success "Files transferred"

# Step 4: Execute server setup
print_info "Setting up server environment..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
set -e

echo "Setting up server environment..."

# Update system
sudo apt-get update

# Install nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    sudo apt-get install -y nginx
fi

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Create application directory
sudo mkdir -p /var/www/delivery-platform/admin-panel
sudo chown -R ubuntu:ubuntu /var/www/delivery-platform

# Extract build files
echo "Extracting build files..."
cd /var/www/delivery-platform/admin-panel
tar -xzf /tmp/admin-panel-build.tar.gz

# Set up nginx configuration
echo "Configuring nginx..."
sudo cp /tmp/nginx-admin.conf /etc/nginx/sites-available/admin-panel
sudo ln -sf /etc/nginx/sites-available/admin-panel /etc/nginx/sites-enabled/admin-panel

# Remove default nginx site if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Restart nginx
echo "Restarting nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Clean up
rm /tmp/admin-panel-build.tar.gz
rm /tmp/server-setup.sh
rm /tmp/nginx-admin.conf

echo "Server setup completed!"
ENDSSH

print_success "Server setup completed"

# Step 5: Verify deployment
print_info "Verifying deployment..."
sleep 2

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP)
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "304" ]; then
    print_success "Deployment successful!"
    echo ""
    echo "======================================"
    echo "Admin Panel is now live!"
    echo "======================================"
    echo ""
    echo "Access your admin panel at:"
    echo "  http://$SERVER_IP"
    echo ""
    echo "Default credentials:"
    echo "  Email: admin@delivery-platform.com"
    echo "  Password: admin123"
    echo ""
    echo "IMPORTANT: Please change the default password immediately!"
    echo ""
else
    print_error "Deployment verification failed (HTTP $RESPONSE)"
    echo "Please check the server logs for details:"
    echo "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'sudo journalctl -u nginx -n 50'"
fi

# Cleanup local build files
print_info "Cleaning up local build files..."
rm -f admin-panel-build.tar.gz

print_success "Deployment process completed!"
