#!/bin/bash

################################################################################
# Monitoring and Alerts Setup Script
# Configures Prometheus, Grafana, and AlertManager
################################################################################

set -e

# Configuration
SERVER_IP="${SERVER_IP:-52.66.71.133}"
SERVER_USER="${SERVER_USER:-ubuntu}"
SSH_KEY="${SSH_KEY:-~/.ssh/deploy_key}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Alert Configuration
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"
ALERT_EMAIL="${ALERT_EMAIL:-}"

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
echo "  Monitoring Stack Setup"
echo "=========================================="
echo ""

# Gather alert configuration
echo "Alert Configuration (optional, press Enter to skip):"
echo ""

if [ -z "$SLACK_WEBHOOK" ]; then
    read -p "Slack Webhook URL: " SLACK_WEBHOOK
fi

if [ -z "$ALERT_EMAIL" ]; then
    read -p "Alert Email Address: " ALERT_EMAIL
fi

echo ""
print_step "Starting monitoring stack deployment..."
echo ""

# Transfer monitoring configuration
print_info "Transferring monitoring configuration..."

cd "$PROJECT_ROOT/monitoring"
tar -czf /tmp/monitoring.tar.gz \
    --exclude='data' \
    --exclude='.git' \
    .

scp -i "$SSH_KEY" -o StrictHostKeyChecking=no \
    /tmp/monitoring.tar.gz \
    $SERVER_USER@$SERVER_IP:/tmp/

print_success "Configuration transferred"

# Setup monitoring on server
print_info "Setting up monitoring stack..."

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << ENDSSH
set -e

# Create monitoring directory
mkdir -p /var/www/delivery-platform/monitoring
cd /var/www/delivery-platform/monitoring

# Extract configuration
tar -xzf /tmp/monitoring.tar.gz

# Create data directories
mkdir -p prometheus/data grafana/data alertmanager/data
chmod -R 777 prometheus/data grafana/data alertmanager/data

# Configure AlertManager if credentials provided
if [ ! -z "$SLACK_WEBHOOK" ] || [ ! -z "$ALERT_EMAIL" ]; then
    cat > alertmanager/alertmanager.yml << 'EOF'
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'

receivers:
  - name: 'default'
    email_configs:
EOF

    if [ ! -z "$ALERT_EMAIL" ]; then
        cat >> alertmanager/alertmanager.yml << EOF
      - to: '$ALERT_EMAIL'
        from: 'alerts@delivery-platform.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'your-email@gmail.com'
        auth_password: 'your-app-password'
        headers:
          Subject: '[DeliveryPlatform] {{ .GroupLabels.alertname }}'
EOF
    fi

    if [ ! -z "$SLACK_WEBHOOK" ]; then
        cat >> alertmanager/alertmanager.yml << EOF
    slack_configs:
      - api_url: '$SLACK_WEBHOOK'
        channel: '#alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}\n{{ end }}'
EOF
    fi
fi

# Start monitoring stack with Docker Compose
echo "Starting monitoring services..."

if [ -f "docker-compose.yml" ]; then
    # Stop existing containers
    docker-compose down || true

    # Start services
    docker-compose up -d

    # Wait for services to start
    echo "Waiting for services to start..."
    sleep 10

    # Check status
    docker-compose ps
else
    echo "Warning: docker-compose.yml not found, installing monitoring manually..."

    # Pull images
    docker pull prom/prometheus:latest
    docker pull grafana/grafana:latest
    docker pull prom/alertmanager:latest
    docker pull prom/node-exporter:latest

    # Run Prometheus
    docker run -d --name prometheus \
        --network host \
        -v /var/www/delivery-platform/monitoring/prometheus:/etc/prometheus \
        -v /var/www/delivery-platform/monitoring/prometheus/data:/prometheus \
        prom/prometheus:latest \
        --config.file=/etc/prometheus/prometheus.yml \
        --storage.tsdb.path=/prometheus

    # Run Grafana
    docker run -d --name grafana \
        -p 3000:3000 \
        -v /var/www/delivery-platform/monitoring/grafana/data:/var/lib/grafana \
        -v /var/www/delivery-platform/monitoring/grafana/dashboards:/etc/grafana/dashboards \
        -e "GF_SECURITY_ADMIN_PASSWORD=admin" \
        grafana/grafana:latest

    # Run AlertManager
    docker run -d --name alertmanager \
        -p 9093:9093 \
        -v /var/www/delivery-platform/monitoring/alertmanager:/etc/alertmanager \
        prom/alertmanager:latest \
        --config.file=/etc/alertmanager/alertmanager.yml

    # Run Node Exporter
    docker run -d --name node-exporter \
        --network host \
        prom/node-exporter:latest
fi

# Cleanup
rm -f /tmp/monitoring.tar.gz

echo "Monitoring stack deployed successfully"
ENDSSH

rm -f /tmp/monitoring.tar.gz

print_success "Monitoring stack deployed"
echo ""

# Import Grafana dashboards
print_info "Configuring Grafana dashboards..."

sleep 5

# Wait for Grafana to be ready
print_step "Waiting for Grafana to start..."
for i in {1..30}; do
    if curl -s http://$SERVER_IP:3000/api/health > /dev/null 2>&1; then
        print_success "Grafana is ready"
        break
    fi
    sleep 2
done

print_success "Monitoring stack is running"
echo ""

echo "=========================================="
echo "  Monitoring Services"
echo "=========================================="
echo ""

print_success "Grafana Dashboard: http://$SERVER_IP:3000"
echo "  Username: admin"
echo "  Password: admin"
echo "  (Change password on first login)"
echo ""

print_success "Prometheus: http://$SERVER_IP:9090"
echo "  Query metrics and view targets"
echo ""

print_success "AlertManager: http://$SERVER_IP:9093"
echo "  View and manage alerts"
echo ""

echo "=========================================="
echo "  Next Steps"
echo "=========================================="
echo ""

echo "1. Login to Grafana and change admin password"
echo "2. Add Prometheus data source in Grafana:"
echo "   - URL: http://prometheus:9090"
echo "   - Access: Server (default)"
echo ""

echo "3. Import dashboards:"
echo "   - Go to Dashboards → Import"
echo "   - Upload dashboard JSON files from monitoring/grafana/dashboards/"
echo ""

echo "4. Configure alert notifications:"
echo "   - Go to Alerting → Contact points"
echo "   - Add email, Slack, or other notification channels"
echo ""

echo "5. Set up alert rules:"
echo "   - Go to Alerting → Alert rules"
echo "   - Create custom alerts for your services"
echo ""

if [ -z "$SLACK_WEBHOOK" ] && [ -z "$ALERT_EMAIL" ]; then
    print_warning "No alert channels configured"
    echo "  To add alerts later, edit: /var/www/delivery-platform/monitoring/alertmanager/alertmanager.yml"
    echo "  Then restart: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'cd /var/www/delivery-platform/monitoring && docker-compose restart alertmanager'"
fi

echo ""
print_success "Monitoring setup complete!"
echo ""

# Test Prometheus targets
print_info "Testing Prometheus targets..."
sleep 2

TARGETS=$(curl -s http://$SERVER_IP:9090/api/v1/targets 2>/dev/null || echo "")

if echo "$TARGETS" | grep -q '"health":"up"'; then
    print_success "Some targets are healthy"
else
    print_warning "Could not verify target health, check Prometheus UI"
fi

echo ""
echo "=========================================="
echo "  Quick Access Commands"
echo "=========================================="
echo ""

echo "View logs:"
echo "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'cd /var/www/delivery-platform/monitoring && docker-compose logs -f'"
echo ""

echo "Restart monitoring:"
echo "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'cd /var/www/delivery-platform/monitoring && docker-compose restart'"
echo ""

echo "Stop monitoring:"
echo "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'cd /var/www/delivery-platform/monitoring && docker-compose down'"
echo ""
