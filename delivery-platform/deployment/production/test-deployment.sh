#!/bin/bash

################################################################################
# Deployment Testing and Verification Script
# Tests all components of the delivery platform
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
MAGENTA='\033[0;35m'
NC='\033[0m'

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_WARNING=0

print_success() { echo -e "${GREEN}✓ $1${NC}"; ((TESTS_PASSED++)); }
print_error() { echo -e "${RED}✗ $1${NC}"; ((TESTS_FAILED++)); }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; ((TESTS_WARNING++)); }
print_info() { echo -e "${BLUE}➜ $1${NC}"; }
print_test() { echo -e "${CYAN}▶ Testing: $1${NC}"; }
print_header() { echo -e "\n${MAGENTA}========================================${NC}"; echo -e "${MAGENTA}  $1${NC}"; echo -e "${MAGENTA}========================================${NC}\n"; }

# Test function
run_test() {
    local test_name=$1
    local test_command=$2
    local expected=$3

    print_test "$test_name"

    if eval "$test_command"; then
        print_success "$test_name"
    else
        if [ "$expected" = "warning" ]; then
            print_warning "$test_name (optional)"
        else
            print_error "$test_name"
        fi
    fi
}

# Test server connectivity
test_server_connectivity() {
    print_header "Server Connectivity"

    # SSH connection
    run_test "SSH Connection" \
        "ssh -i '$SSH_KEY' -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP 'echo ok' > /dev/null 2>&1"

    # Server uptime
    UPTIME=$(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "uptime -p" 2>/dev/null || echo "unknown")
    print_info "Server uptime: $UPTIME"

    # Disk space
    DISK_USAGE=$(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "df -h / | tail -1 | awk '{print \$5}'" 2>/dev/null || echo "unknown")
    print_info "Disk usage: $DISK_USAGE"

    # Memory usage
    MEM_USAGE=$(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "free -h | grep Mem | awk '{print \$3\"/\"\$2}'" 2>/dev/null || echo "unknown")
    print_info "Memory usage: $MEM_USAGE"
}

# Test admin panel
test_admin_panel() {
    print_header "Admin Panel"

    # HTTP accessibility
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "304" ]; then
        print_success "Admin panel HTTP accessible (HTTP $HTTP_CODE)"
    else
        print_error "Admin panel not accessible (HTTP $HTTP_CODE)"
    fi

    # HTTPS accessibility (if domain configured)
    if [ -n "$DOMAIN" ]; then
        HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN 2>/dev/null || echo "000")
        if [ "$HTTPS_CODE" = "200" ] || [ "$HTTPS_CODE" = "304" ]; then
            print_success "Admin panel HTTPS accessible (HTTP $HTTPS_CODE)"
        else
            print_warning "Admin panel HTTPS not accessible (HTTP $HTTPS_CODE)"
        fi
    fi

    # Check nginx status
    run_test "Nginx service running" \
        "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP 'systemctl is-active nginx' | grep -q 'active'"

    # Check nginx error logs
    ERROR_COUNT=$(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "sudo tail -100 /var/log/nginx/error.log 2>/dev/null | grep -c 'error' || echo 0")
    if [ "$ERROR_COUNT" -lt 10 ]; then
        print_success "Nginx errors acceptable ($ERROR_COUNT recent errors)"
    else
        print_warning "Nginx has $ERROR_COUNT recent errors"
    fi
}

# Test backend services
test_backend_services() {
    print_header "Backend Services"

    # Check if PM2 is installed
    run_test "PM2 installed" \
        "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP 'command -v pm2' > /dev/null 2>&1"

    # Get PM2 status
    PM2_OUTPUT=$(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "pm2 jlist 2>/dev/null" || echo "[]")

    if [ "$PM2_OUTPUT" = "[]" ]; then
        print_warning "No PM2 processes running"
    else
        # Count running services
        RUNNING_COUNT=$(echo "$PM2_OUTPUT" | grep -o '"status":"online"' | wc -l || echo 0)
        TOTAL_COUNT=$(echo "$PM2_OUTPUT" | grep -o '"name":' | wc -l || echo 0)

        if [ "$RUNNING_COUNT" -gt 0 ]; then
            print_success "$RUNNING_COUNT/$TOTAL_COUNT backend services running"
        else
            print_warning "Backend services not running"
        fi

        # List services
        print_info "Service status:"
        ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "pm2 list 2>/dev/null | tail -n +4 | head -n -1" || true
    fi
}

# Test databases
test_databases() {
    print_header "Databases"

    # PostgreSQL
    run_test "PostgreSQL service" \
        "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP 'systemctl is-active postgresql' | grep -q 'active'"

    # Test PostgreSQL connection
    PG_TEST=$(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "sudo -u postgres psql -c '\l' 2>/dev/null | grep -c delivery_platform || echo 0")
    if [ "$PG_TEST" -gt 0 ]; then
        print_success "PostgreSQL database exists"
    else
        print_warning "PostgreSQL database not found"
    fi

    # Redis
    run_test "Redis service" \
        "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP 'systemctl is-active redis-server' | grep -q 'active'" \
        "warning"

    # Test Redis connection
    run_test "Redis connection" \
        "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP 'redis-cli ping 2>/dev/null' | grep -q 'PONG'" \
        "warning"
}

# Test monitoring
test_monitoring() {
    print_header "Monitoring Stack"

    # Grafana
    GRAFANA_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:3000/api/health 2>/dev/null || echo "000")
    if [ "$GRAFANA_CODE" = "200" ]; then
        print_success "Grafana accessible (HTTP $GRAFANA_CODE)"
    else
        print_warning "Grafana not accessible (HTTP $GRAFANA_CODE)"
    fi

    # Prometheus
    PROM_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:9090/-/healthy 2>/dev/null || echo "000")
    if [ "$PROM_CODE" = "200" ]; then
        print_success "Prometheus accessible (HTTP $PROM_CODE)"
    else
        print_warning "Prometheus not accessible (HTTP $PROM_CODE)"
    fi

    # Check Prometheus targets
    TARGETS_UP=$(curl -s http://$SERVER_IP:9090/api/v1/targets 2>/dev/null | grep -o '"health":"up"' | wc -l || echo 0)
    if [ "$TARGETS_UP" -gt 0 ]; then
        print_success "$TARGETS_UP Prometheus targets healthy"
    else
        print_warning "No healthy Prometheus targets"
    fi

    # AlertManager
    ALERT_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:9093/-/healthy 2>/dev/null || echo "000")
    if [ "$ALERT_CODE" = "200" ]; then
        print_success "AlertManager accessible (HTTP $ALERT_CODE)"
    else
        print_warning "AlertManager not accessible (HTTP $ALERT_CODE)"
    fi
}

# Test security
test_security() {
    print_header "Security"

    # Check firewall
    run_test "UFW firewall enabled" \
        "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP 'sudo ufw status' | grep -q 'Status: active'" \
        "warning"

    # Check SSH configuration
    run_test "SSH password authentication disabled" \
        "ssh -i '$SSH_KEY' -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP 'sudo grep -q \"^PasswordAuthentication no\" /etc/ssh/sshd_config'" \
        "warning"

    # Check for security updates
    UPDATES=$(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "apt list --upgradable 2>/dev/null | grep -c security || echo 0")
    if [ "$UPDATES" -eq 0 ]; then
        print_success "No security updates pending"
    else
        print_warning "$UPDATES security updates available"
    fi

    # SSL certificate (if domain configured)
    if [ -n "$DOMAIN" ]; then
        SSL_EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2 || echo "unknown")
        if [ "$SSL_EXPIRY" != "unknown" ]; then
            print_success "SSL certificate valid until: $SSL_EXPIRY"
        else
            print_warning "SSL certificate not found or invalid"
        fi
    fi
}

# Test API endpoints
test_api_endpoints() {
    print_header "API Endpoints"

    # Test health endpoints
    local ports=(3001 3002 3003 3004 3005 3006 3007 3008 3009 3010)
    local services=("user" "restaurant" "order" "delivery" "payment" "notification" "search" "pricing" "route-optimization" "fraud-detection")

    for i in "${!ports[@]}"; do
        PORT=${ports[$i]}
        SERVICE=${services[$i]}

        # Test if port is listening
        PORT_OPEN=$(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "netstat -tuln 2>/dev/null | grep -c ':$PORT ' || echo 0")

        if [ "$PORT_OPEN" -gt 0 ]; then
            print_success "$SERVICE service listening on port $PORT"
        else
            print_warning "$SERVICE service not listening on port $PORT"
        fi
    done
}

# Test performance
test_performance() {
    print_header "Performance"

    # Response time
    print_test "Measuring response time..."
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://$SERVER_IP 2>/dev/null || echo "999")

    if (( $(echo "$RESPONSE_TIME < 1.0" | bc -l 2>/dev/null || echo 0) )); then
        print_success "Response time: ${RESPONSE_TIME}s (good)"
    elif (( $(echo "$RESPONSE_TIME < 3.0" | bc -l 2>/dev/null || echo 0) )); then
        print_warning "Response time: ${RESPONSE_TIME}s (acceptable)"
    else
        print_warning "Response time: ${RESPONSE_TIME}s (slow)"
    fi

    # Load average
    LOAD=$(ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "uptime | awk -F'load average:' '{print \$2}' | awk '{print \$1}'" 2>/dev/null || echo "unknown")
    print_info "Server load average: $LOAD"
}

# Generate report
generate_report() {
    print_header "Test Summary"

    TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED + TESTS_WARNING))

    echo ""
    echo "Total Tests: $TOTAL_TESTS"
    echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
    echo -e "${YELLOW}Warnings: $TESTS_WARNING${NC}"
    echo -e "${RED}Failed: $TESTS_FAILED${NC}"
    echo ""

    if [ "$TESTS_FAILED" -eq 0 ]; then
        if [ "$TESTS_WARNING" -eq 0 ]; then
            print_success "All tests passed! Platform is fully operational."
        else
            echo -e "${YELLOW}⚠ Platform is operational with $TESTS_WARNING warnings.${NC}"
        fi
    else
        echo -e "${RED}✗ Platform has $TESTS_FAILED critical issues that need attention.${NC}"
    fi

    echo ""
    echo "=========================================="
    echo "  Access Points"
    echo "=========================================="
    echo ""
    echo "Admin Panel:"
    echo "  http://$SERVER_IP"
    if [ -n "$DOMAIN" ]; then
        echo "  https://$DOMAIN"
    fi
    echo ""
    echo "Monitoring:"
    echo "  Grafana:      http://$SERVER_IP:3000"
    echo "  Prometheus:   http://$SERVER_IP:9090"
    echo "  AlertManager: http://$SERVER_IP:9093"
    echo ""
}

# Main execution
main() {
    clear
    print_header "Delivery Platform Deployment Test"

    echo "Testing deployment on: $SERVER_USER@$SERVER_IP"
    if [ -n "$DOMAIN" ]; then
        echo "Domain: $DOMAIN"
    fi
    echo ""

    test_server_connectivity
    test_admin_panel
    test_backend_services
    test_databases
    test_monitoring
    test_security
    test_api_endpoints
    test_performance

    generate_report

    # Save report
    REPORT_FILE="/tmp/deployment-test-$(date +%Y%m%d-%H%M%S).txt"
    {
        echo "Deployment Test Report"
        echo "Date: $(date)"
        echo "Server: $SERVER_USER@$SERVER_IP"
        echo ""
        echo "Tests Passed: $TESTS_PASSED"
        echo "Tests Failed: $TESTS_FAILED"
        echo "Warnings: $TESTS_WARNING"
    } > "$REPORT_FILE"

    print_info "Report saved to: $REPORT_FILE"
    echo ""
}

# Run main
main "$@"
