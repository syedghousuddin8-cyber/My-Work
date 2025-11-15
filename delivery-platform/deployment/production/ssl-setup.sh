#!/bin/bash

################################################################################
# SSL Certificate Setup Script
# Configures Let's Encrypt SSL certificate for the admin panel
################################################################################

set -e

# Configuration
SERVER_IP="${SERVER_IP:-52.66.71.133}"
SERVER_USER="${SERVER_USER:-ubuntu}"
SSH_KEY="${SSH_KEY:-~/.ssh/deploy_key}"
DOMAIN="${DOMAIN:-}"
EMAIL="${EMAIL:-admin@${DOMAIN}}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}➜ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }

echo ""
echo "=========================================="
echo "  SSL Certificate Setup"
echo "=========================================="
echo ""

# Check if domain is provided
if [ -z "$DOMAIN" ]; then
    echo "Please enter your domain name (e.g., admin.delivery-platform.com):"
    read -r DOMAIN
fi

if [ -z "$DOMAIN" ]; then
    print_error "Domain name is required"
    exit 1
fi

echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo "Server: $SERVER_IP"
echo ""

read -p "Continue with SSL setup? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "SSL setup cancelled"
    exit 0
fi

print_info "Checking DNS configuration..."
RESOLVED_IP=$(dig +short "$DOMAIN" | tail -n1)

if [ "$RESOLVED_IP" != "$SERVER_IP" ]; then
    print_warning "Domain $DOMAIN resolves to $RESOLVED_IP, but server is $SERVER_IP"
    print_warning "Please ensure your DNS A record points to $SERVER_IP"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
else
    print_success "DNS configured correctly"
fi

print_info "Installing Certbot and obtaining SSL certificate..."

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << ENDSSH
set -e

echo "Installing certbot..."
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

echo "Obtaining SSL certificate for $DOMAIN..."
sudo certbot --nginx -d $DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect

# Test auto-renewal
echo "Testing certificate renewal..."
sudo certbot renew --dry-run

# Enable auto-renewal
echo "Enabling automatic renewal..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "SSL certificate installed successfully"
ENDSSH

print_success "SSL certificate configured"
print_success "Your site is now accessible at: https://$DOMAIN"
echo ""

print_info "Testing HTTPS..."
sleep 2
HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN || echo "000")

if [ "$HTTPS_CODE" = "200" ] || [ "$HTTPS_CODE" = "304" ]; then
    print_success "HTTPS is working correctly (HTTP $HTTPS_CODE)"
else
    print_warning "HTTPS returned HTTP $HTTPS_CODE"
fi

echo ""
echo "=========================================="
print_success "SSL Setup Complete!"
echo "=========================================="
echo ""
echo "Your admin panel is now accessible at:"
echo "  https://$DOMAIN"
echo ""
echo "Certificate will auto-renew before expiration."
echo "Check renewal status:"
echo "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'sudo certbot certificates'"
echo ""
