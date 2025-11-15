#!/bin/bash

# Quick Deployment Script for Admin Panel
# This is a simplified version for quick deployment

set -e

# Configuration
SERVER_IP="52.66.71.133"
SERVER_USER="ubuntu"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ADMIN_DIR="$PROJECT_ROOT/frontend/admin-dashboard"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }

echo ""
echo "======================================"
echo "  Admin Panel Quick Deploy"
echo "======================================"
echo ""

# Check if SSH key exists
if [ ! -f ~/.ssh/deploy_key ]; then
    print_error "SSH key not found!"
    echo ""
    echo "Please save the SSH key to ~/.ssh/deploy_key:"
    echo "1. Create the file: nano ~/.ssh/deploy_key"
    echo "2. Paste the provided RSA private key"
    echo "3. Save and exit (Ctrl+X, Y, Enter)"
    echo "4. Set permissions: chmod 600 ~/.ssh/deploy_key"
    echo ""
    exit 1
fi

# Check if admin dashboard exists
if [ ! -d "$ADMIN_DIR" ]; then
    print_error "Admin dashboard not found at $ADMIN_DIR"
    exit 1
fi

print_info "Project root: $PROJECT_ROOT"
print_info "Admin dashboard: $ADMIN_DIR"
echo ""

# Step 1: Build the application
print_info "Step 1/4: Building admin panel..."
cd "$ADMIN_DIR"

if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
fi

print_info "Building for production..."
npm run build

if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

print_success "Build completed"
echo ""

# Step 2: Create deployment package
print_info "Step 2/4: Creating deployment package..."
cd dist
tar -czf admin-panel.tar.gz .
mv admin-panel.tar.gz /tmp/
print_success "Package created: /tmp/admin-panel.tar.gz"
echo ""

# Step 3: Transfer files to server
print_info "Step 3/4: Transferring files to server..."

scp -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no \
    /tmp/admin-panel.tar.gz \
    $SERVER_USER@$SERVER_IP:/tmp/

scp -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no \
    "$SCRIPT_DIR/nginx-admin.conf" \
    $SERVER_USER@$SERVER_IP:/tmp/

print_success "Files transferred"
echo ""

# Step 4: Deploy on server
print_info "Step 4/4: Deploying on server..."

ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
set -e

echo "Setting up server..."

# Install nginx if needed
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Create directory
sudo mkdir -p /var/www/delivery-platform/admin-panel
sudo chown -R ubuntu:ubuntu /var/www/delivery-platform

# Extract files
echo "Extracting files..."
cd /var/www/delivery-platform/admin-panel
tar -xzf /tmp/admin-panel.tar.gz

# Configure nginx
echo "Configuring nginx..."
sudo cp /tmp/nginx-admin.conf /etc/nginx/sites-available/admin-panel
sudo ln -sf /etc/nginx/sites-available/admin-panel /etc/nginx/sites-enabled/admin-panel
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart nginx
if sudo nginx -t; then
    echo "Restarting nginx..."
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    echo "✓ Nginx configured and restarted"
else
    echo "✗ Nginx configuration test failed"
    exit 1
fi

# Cleanup
rm -f /tmp/admin-panel.tar.gz /tmp/nginx-admin.conf

echo "✓ Deployment completed on server"
ENDSSH

print_success "Server deployment completed"
echo ""

# Step 5: Verify deployment
print_info "Verifying deployment..."
sleep 2

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
    echo ""
    echo "======================================"
    print_success "DEPLOYMENT SUCCESSFUL!"
    echo "======================================"
    echo ""
    echo "🌐 Admin Panel URL: http://$SERVER_IP"
    echo ""
    echo "📧 Default Login:"
    echo "   Email: admin@delivery-platform.com"
    echo "   Password: admin123"
    echo ""
    print_warning "IMPORTANT: Change the default password immediately!"
    echo ""
else
    print_error "Verification failed (HTTP $HTTP_CODE)"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check nginx status:"
    echo "   ssh -i ~/.ssh/deploy_key $SERVER_USER@$SERVER_IP 'sudo systemctl status nginx'"
    echo ""
    echo "2. Check nginx logs:"
    echo "   ssh -i ~/.ssh/deploy_key $SERVER_USER@$SERVER_IP 'sudo tail -f /var/log/nginx/error.log'"
    echo ""
fi

# Cleanup local files
rm -f /tmp/admin-panel.tar.gz

print_success "Deployment process completed!"
echo ""
