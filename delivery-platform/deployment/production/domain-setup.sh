#!/bin/bash

################################################################################
# Domain Configuration Script
# Helps configure domain name for the delivery platform
################################################################################

set -e

# Configuration
SERVER_IP="${SERVER_IP:-52.66.71.133}"
SERVER_USER="${SERVER_USER:-ubuntu}"
SSH_KEY="${SSH_KEY:-~/.ssh/deploy_key}"
DOMAIN="${DOMAIN:-}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}➜ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_step() { echo -e "${CYAN}▶ $1${NC}"; }

echo ""
echo "=========================================="
echo "  Domain Configuration Guide"
echo "=========================================="
echo ""

# Get domain name
if [ -z "$DOMAIN" ]; then
    echo "Please enter your domain name (e.g., admin.delivery-platform.com):"
    read -r DOMAIN
fi

if [ -z "$DOMAIN" ]; then
    print_error "Domain name is required"
    exit 1
fi

echo ""
print_info "Server IP: $SERVER_IP"
print_info "Domain: $DOMAIN"
echo ""

echo "=========================================="
echo "  DNS Configuration Instructions"
echo "=========================================="
echo ""

echo "To point your domain to the server, add the following DNS records"
echo "in your domain registrar's control panel (GoDaddy, Namecheap, etc.):"
echo ""

print_step "1. Add A Record for Admin Panel:"
echo ""
echo "  Type:  A"
echo "  Name:  @ (or admin if using subdomain)"
echo "  Value: $SERVER_IP"
echo "  TTL:   3600"
echo ""

print_step "2. Add A Record for API (optional):"
echo ""
echo "  Type:  A"
echo "  Name:  api"
echo "  Value: $SERVER_IP"
echo "  TTL:   3600"
echo ""

print_step "3. Add CNAME for www (optional):"
echo ""
echo "  Type:  CNAME"
echo "  Name:  www"
echo "  Value: $DOMAIN"
echo "  TTL:   3600"
echo ""

echo "=========================================="
echo "  Common Domain Registrars"
echo "=========================================="
echo ""

echo "GoDaddy:"
echo "  1. Go to https://dcc.godaddy.com/manage/dns"
echo "  2. Select your domain"
echo "  3. Click 'Add' under DNS Records"
echo "  4. Add the A record shown above"
echo ""

echo "Namecheap:"
echo "  1. Go to https://ap.www.namecheap.com/domains/list/"
echo "  2. Click 'Manage' next to your domain"
echo "  3. Go to 'Advanced DNS' tab"
echo "  4. Add the A record shown above"
echo ""

echo "Cloudflare:"
echo "  1. Go to https://dash.cloudflare.com/"
echo "  2. Select your domain"
echo "  3. Go to 'DNS' section"
echo "  4. Add the A record shown above"
echo ""

echo "Google Domains:"
echo "  1. Go to https://domains.google.com/registrar/"
echo "  2. Select your domain"
echo "  3. Click 'DNS' in the left menu"
echo "  4. Scroll to 'Custom records'"
echo "  5. Add the A record shown above"
echo ""

echo "=========================================="
print_info "Checking Current DNS Configuration"
echo "=========================================="
echo ""

print_step "Looking up $DOMAIN..."
RESOLVED_IP=$(dig +short "$DOMAIN" | tail -n1 2>/dev/null || echo "")

if [ -z "$RESOLVED_IP" ]; then
    print_warning "Domain $DOMAIN does not resolve yet"
    echo "  Please add the DNS records shown above and wait 5-10 minutes"
elif [ "$RESOLVED_IP" = "$SERVER_IP" ]; then
    print_success "Domain $DOMAIN correctly points to $SERVER_IP"
    echo ""
    print_info "You can now run the SSL setup script:"
    echo "  ./ssl-setup.sh"
else
    print_warning "Domain $DOMAIN resolves to $RESOLVED_IP (expected $SERVER_IP)"
    echo "  Please update your DNS A record to point to $SERVER_IP"
fi

echo ""

# Offer to test when ready
read -p "Would you like to wait and test DNS propagation? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    print_info "Testing DNS propagation every 10 seconds..."
    print_info "Press Ctrl+C to cancel"
    echo ""

    while true; do
        RESOLVED_IP=$(dig +short "$DOMAIN" | tail -n1 2>/dev/null || echo "")

        if [ "$RESOLVED_IP" = "$SERVER_IP" ]; then
            print_success "DNS propagated successfully! $DOMAIN -> $SERVER_IP"
            echo ""
            print_info "Next steps:"
            echo "  1. Update nginx configuration with domain name"
            echo "  2. Run SSL setup: ./ssl-setup.sh"
            break
        else
            echo "  Current: $DOMAIN -> ${RESOLVED_IP:-Not resolved} (waiting...)"
            sleep 10
        fi
    done
fi

echo ""
echo "=========================================="
print_info "Update Nginx Configuration"
echo "=========================================="
echo ""

echo "Once DNS is configured, update nginx to use your domain:"
echo ""

cat << 'EOF'
ssh -i ~/.ssh/deploy_key ubuntu@$SERVER_IP
sudo nano /etc/nginx/sites-available/admin-panel

# Update server_name line to:
server_name your-domain.com www.your-domain.com;

# Save and test
sudo nginx -t
sudo systemctl reload nginx
EOF

echo ""
echo "=========================================="
echo "  Summary"
echo "=========================================="
echo ""
echo "1. Add DNS A record: $DOMAIN -> $SERVER_IP"
echo "2. Wait 5-10 minutes for DNS propagation"
echo "3. Update nginx configuration with domain name"
echo "4. Run: ./ssl-setup.sh to enable HTTPS"
echo ""
