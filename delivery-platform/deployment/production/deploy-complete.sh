#!/bin/bash

################################################################################
# Complete Production Deployment Script
# Deploys the entire Delivery Platform stack
################################################################################

set -e

# Configuration
SERVER_IP="${SERVER_IP:-52.66.71.133}"
SERVER_USER="${SERVER_USER:-ubuntu}"
SSH_KEY="${SSH_KEY:-~/.ssh/deploy_key}"
DOMAIN="${DOMAIN:-}"  # Optional: Set your domain name
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Output functions
print_header() { echo -e "\n${MAGENTA}========================================${NC}"; echo -e "${MAGENTA}  $1${NC}"; echo -e "${MAGENTA}========================================${NC}\n"; }
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}➜ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_step() { echo -e "${CYAN}▶ $1${NC}"; }

# Error handling
error_exit() {
    print_error "$1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"

    # Check SSH key
    if [ ! -f "$SSH_KEY" ]; then
        error_exit "SSH key not found at $SSH_KEY"
    fi
    print_success "SSH key found"

    # Check SSH connection
    print_info "Testing SSH connection..."
    if ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo 'SSH connection successful'" > /dev/null 2>&1; then
        print_success "SSH connection successful"
    else
        error_exit "Cannot connect to server via SSH"
    fi

    # Check Node.js
    if ! command -v node &> /dev/null; then
        error_exit "Node.js is not installed. Please install Node.js 18+"
    fi
    print_success "Node.js installed ($(node -v))"

    # Check npm
    if ! command -v npm &> /dev/null; then
        error_exit "npm is not installed"
    fi
    print_success "npm installed ($(npm -v))"

    echo ""
}

# Deploy admin panel
deploy_admin_panel() {
    print_header "Deploying Admin Panel"

    cd "$PROJECT_ROOT/frontend/admin-dashboard"

    print_step "Installing dependencies..."
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    print_success "Dependencies ready"

    print_step "Building admin panel..."
    npm run build

    if [ ! -d "dist" ]; then
        error_exit "Build failed - dist directory not found"
    fi
    print_success "Build completed"

    print_step "Creating deployment package..."
    cd dist
    tar -czf /tmp/admin-panel.tar.gz .
    print_success "Package created"

    print_step "Transferring to server..."
    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
        /tmp/admin-panel.tar.gz \
        $SERVER_USER@$SERVER_IP:/tmp/

    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
        "$SCRIPT_DIR/nginx-admin.conf" \
        $SERVER_USER@$SERVER_IP:/tmp/

    print_success "Files transferred"

    print_step "Deploying on server..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
        set -e

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
        cd /var/www/delivery-platform/admin-panel
        tar -xzf /tmp/admin-panel.tar.gz

        # Configure nginx
        sudo cp /tmp/nginx-admin.conf /etc/nginx/sites-available/admin-panel
        sudo ln -sf /etc/nginx/sites-available/admin-panel /etc/nginx/sites-enabled/admin-panel
        sudo rm -f /etc/nginx/sites-enabled/default

        # Test and restart nginx
        sudo nginx -t && sudo systemctl restart nginx
        sudo systemctl enable nginx

        # Cleanup
        rm -f /tmp/admin-panel.tar.gz /tmp/nginx-admin.conf

        echo "Admin panel deployed successfully"
ENDSSH

    print_success "Admin panel deployed"
    rm -f /tmp/admin-panel.tar.gz
    echo ""
}

# Test admin panel
test_admin_panel() {
    print_header "Testing Admin Panel"

    print_step "Waiting for service to start..."
    sleep 3

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP || echo "000")

    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
        print_success "Admin panel is accessible (HTTP $HTTP_CODE)"
        print_info "URL: http://$SERVER_IP"
    else
        print_warning "Admin panel returned HTTP $HTTP_CODE"
    fi
    echo ""
}

# Setup server infrastructure
setup_server_infrastructure() {
    print_header "Setting Up Server Infrastructure"

    print_step "Installing required packages..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
        set -e

        echo "Updating system packages..."
        sudo apt-get update

        # Install Node.js 20 if not installed
        if ! command -v node &> /dev/null; then
            echo "Installing Node.js 20..."
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt-get install -y nodejs
        fi

        # Install PM2
        if ! command -v pm2 &> /dev/null; then
            echo "Installing PM2..."
            sudo npm install -g pm2
        fi

        # Install PostgreSQL
        if ! command -v psql &> /dev/null; then
            echo "Installing PostgreSQL..."
            sudo apt-get install -y postgresql postgresql-contrib postgresql-14-postgis-3
        fi

        # Install Redis
        if ! command -v redis-cli &> /dev/null; then
            echo "Installing Redis..."
            sudo apt-get install -y redis-server
            sudo systemctl enable redis-server
            sudo systemctl start redis-server
        fi

        # Install Docker (for Kafka, Elasticsearch, etc.)
        if ! command -v docker &> /dev/null; then
            echo "Installing Docker..."
            curl -fsSL https://get.docker.com -o get-docker.sh
            sudo sh get-docker.sh
            sudo usermod -aG docker ubuntu
            rm get-docker.sh
        fi

        # Install Docker Compose
        if ! command -v docker-compose &> /dev/null; then
            echo "Installing Docker Compose..."
            sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
        fi

        # Install build essentials
        sudo apt-get install -y build-essential python3-pip python3-venv git curl wget htop

        echo "Infrastructure packages installed"
ENDSSH

    print_success "Server infrastructure ready"
    echo ""
}

# Setup databases
setup_databases() {
    print_header "Setting Up Databases"

    print_step "Configuring PostgreSQL..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
        set -e

        # Create PostgreSQL user and database
        sudo -u postgres psql -c "SELECT 1 FROM pg_user WHERE usename = 'delivery_user'" | grep -q 1 || \
        sudo -u postgres psql << EOF
CREATE USER delivery_user WITH PASSWORD 'DeliveryPlatform2024!';
CREATE DATABASE delivery_platform OWNER delivery_user;
\c delivery_platform
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
GRANT ALL PRIVILEGES ON DATABASE delivery_platform TO delivery_user;
EOF

        echo "PostgreSQL configured"

        # Configure PostgreSQL to allow local connections
        sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" /etc/postgresql/14/main/postgresql.conf || true
        sudo systemctl restart postgresql

        echo "Database setup completed"
ENDSSH

    print_success "Databases configured"
    echo ""
}

# Deploy backend services
deploy_backend_services() {
    print_header "Deploying Backend Services"

    print_step "Transferring backend code..."

    # Create backend archive
    cd "$PROJECT_ROOT/backend"
    tar -czf /tmp/backend-services.tar.gz \
        --exclude='node_modules' \
        --exclude='dist' \
        --exclude='.env' \
        services/ ai-services/

    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
        /tmp/backend-services.tar.gz \
        $SERVER_USER@$SERVER_IP:/tmp/

    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
        "$SCRIPT_DIR/ecosystem.config.js" \
        $SERVER_USER@$SERVER_IP:/tmp/

    print_success "Backend code transferred"

    print_step "Setting up backend services..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
        set -e

        # Extract backend services
        mkdir -p /var/www/delivery-platform/backend
        cd /var/www/delivery-platform/backend
        tar -xzf /tmp/backend-services.tar.gz

        # Install dependencies and build each service
        for service in services/*/; do
            if [ -f "$service/package.json" ]; then
                echo "Building $(basename $service)..."
                cd "$service"
                npm install --production
                npm run build || true
                cd /var/www/delivery-platform/backend
            fi
        done

        # Setup AI service
        if [ -d "ai-services/recommendation-service" ]; then
            cd ai-services/recommendation-service
            python3 -m venv venv
            source venv/bin/activate
            pip install -r requirements.txt || true
            deactivate
            cd /var/www/delivery-platform/backend
        fi

        # Copy PM2 ecosystem config
        cp /tmp/ecosystem.config.js /var/www/delivery-platform/

        # Create environment file for services
        cat > /var/www/delivery-platform/.env << 'EOF'
NODE_ENV=production
DATABASE_URL=postgresql://delivery_user:DeliveryPlatform2024!@localhost:5432/delivery_platform
REDIS_URL=redis://localhost:6379
JWT_SECRET=change-this-in-production-use-long-random-string
ELASTICSEARCH_URL=http://localhost:9200
KAFKA_BROKERS=localhost:9092
EOF

        # Cleanup
        rm -f /tmp/backend-services.tar.gz /tmp/ecosystem.config.js

        echo "Backend services ready"
ENDSSH

    print_success "Backend services deployed"
    rm -f /tmp/backend-services.tar.gz
    echo ""
}

# Start backend services with PM2
start_backend_services() {
    print_header "Starting Backend Services"

    print_step "Starting services with PM2..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
        set -e

        cd /var/www/delivery-platform

        # Stop any existing services
        pm2 delete all || true

        # Start services (only the ones that are built)
        for service in backend/services/*/; do
            service_name=$(basename $service)
            if [ -f "$service/dist/index.js" ]; then
                echo "Starting $service_name..."
                cd "$service"
                PORT=$((3000 + $(echo $service_name | md5sum | head -c 2) % 20))
                pm2 start dist/index.js --name "$service_name" --time || true
                cd /var/www/delivery-platform
            fi
        done

        # Save PM2 configuration
        pm2 save

        # Setup PM2 to start on boot
        sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu || true

        echo "Backend services started"
        pm2 list
ENDSSH

    print_success "Backend services started"
    echo ""
}

# Setup SSL with Let's Encrypt
setup_ssl() {
    if [ -z "$DOMAIN" ]; then
        print_warning "No domain specified, skipping SSL setup"
        print_info "To enable SSL later, set DOMAIN variable and run: ./ssl-setup.sh"
        return
    fi

    print_header "Setting Up SSL Certificate"

    print_step "Installing Certbot..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << ENDSSH
        set -e

        # Install certbot
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx

        # Obtain certificate
        sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || true

        # Setup auto-renewal
        sudo systemctl enable certbot.timer

        echo "SSL certificate configured"
ENDSSH

    print_success "SSL configured for $DOMAIN"
    echo ""
}

# Setup monitoring
setup_monitoring() {
    print_header "Setting Up Monitoring"

    print_step "Deploying monitoring stack..."

    # Transfer monitoring configuration
    cd "$PROJECT_ROOT/monitoring"
    tar -czf /tmp/monitoring.tar.gz .

    scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
        /tmp/monitoring.tar.gz \
        $SERVER_USER@$SERVER_IP:/tmp/

    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
        set -e

        # Extract monitoring configuration
        mkdir -p /var/www/delivery-platform/monitoring
        cd /var/www/delivery-platform/monitoring
        tar -xzf /tmp/monitoring.tar.gz

        # Start monitoring stack with Docker Compose
        if [ -f "docker-compose.yml" ]; then
            docker-compose up -d
        fi

        rm -f /tmp/monitoring.tar.gz

        echo "Monitoring stack deployed"
ENDSSH

    print_success "Monitoring configured"
    print_info "Grafana: http://$SERVER_IP:3000 (admin/admin)"
    print_info "Prometheus: http://$SERVER_IP:9090"
    rm -f /tmp/monitoring.tar.gz
    echo ""
}

# Configure firewall
configure_firewall() {
    print_header "Configuring Firewall"

    print_step "Setting up UFW firewall..."
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'
        set -e

        # Install UFW if not installed
        sudo apt-get install -y ufw

        # Configure rules
        sudo ufw --force reset
        sudo ufw default deny incoming
        sudo ufw default allow outgoing

        # Allow SSH
        sudo ufw allow 22/tcp

        # Allow HTTP/HTTPS
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp

        # Allow monitoring (restrict in production)
        sudo ufw allow 3000/tcp  # Grafana
        sudo ufw allow 9090/tcp  # Prometheus

        # Enable firewall
        sudo ufw --force enable

        echo "Firewall configured"
ENDSSH

    print_success "Firewall configured"
    echo ""
}

# Print deployment summary
print_summary() {
    print_header "Deployment Summary"

    echo -e "${GREEN}✓ Admin Panel deployed${NC}"
    echo -e "  URL: http://$SERVER_IP"
    echo -e "  Login: admin@delivery-platform.com / admin123"
    echo ""

    echo -e "${GREEN}✓ Backend services deployed${NC}"
    echo -e "  Status: Check with 'ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP pm2 list'"
    echo ""

    echo -e "${GREEN}✓ Database configured${NC}"
    echo -e "  PostgreSQL: localhost:5432"
    echo -e "  Redis: localhost:6379"
    echo ""

    echo -e "${GREEN}✓ Monitoring stack deployed${NC}"
    echo -e "  Grafana: http://$SERVER_IP:3000"
    echo -e "  Prometheus: http://$SERVER_IP:9090"
    echo ""

    if [ -n "$DOMAIN" ]; then
        echo -e "${GREEN}✓ SSL configured${NC}"
        echo -e "  Domain: https://$DOMAIN"
        echo ""
    fi

    echo -e "${YELLOW}Important Next Steps:${NC}"
    echo -e "  1. Change admin password immediately"
    echo -e "  2. Update environment variables in /var/www/delivery-platform/.env"
    echo -e "  3. Configure external API keys (Stripe, Twilio, SendGrid, etc.)"
    echo -e "  4. Set up automated backups"
    echo -e "  5. Configure alerting in Grafana"
    echo ""

    echo -e "${CYAN}Useful Commands:${NC}"
    echo -e "  SSH to server: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP"
    echo -e "  View PM2 logs: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 logs'"
    echo -e "  Restart services: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'pm2 restart all'"
    echo -e "  Check nginx: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'sudo systemctl status nginx'"
    echo ""
}

# Main deployment flow
main() {
    clear
    print_header "Complete Delivery Platform Deployment"

    echo -e "${CYAN}Configuration:${NC}"
    echo -e "  Server: $SERVER_USER@$SERVER_IP"
    echo -e "  SSH Key: $SSH_KEY"
    echo -e "  Domain: ${DOMAIN:-Not set}"
    echo ""

    read -p "Continue with deployment? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 0
    fi

    # Run deployment steps
    check_prerequisites
    deploy_admin_panel
    test_admin_panel
    setup_server_infrastructure
    setup_databases
    deploy_backend_services
    start_backend_services

    if [ -n "$DOMAIN" ]; then
        setup_ssl
    fi

    setup_monitoring
    configure_firewall

    print_summary

    print_header "Deployment Complete!"
    print_success "Your delivery platform is now live!"
}

# Run main function
main "$@"
