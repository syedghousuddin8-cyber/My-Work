#!/bin/bash
# 6amMart System Status Check Script

echo "========================================="
echo "6amMart System Status Check"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to check service status
check_service() {
    local service=$1
    if systemctl is-active --quiet $service; then
        echo -e "${GREEN}✓${NC} $service is running"
    else
        echo -e "${RED}✗${NC} $service is NOT running"
    fi
}

# Check system information
echo "=== System Information ==="
echo "Hostname: $(hostname)"
echo "IP Address: $(hostname -I | awk '{print $1}')"
echo "OS: $(lsb_release -d | awk -F'\t' '{print $2}')"
echo "Kernel: $(uname -r)"
echo "Uptime: $(uptime -p)"
echo ""

# Check disk space
echo "=== Disk Space ==="
df -h / | tail -n 1 | awk '{printf "Used: %s / %s (%s)\n", $3, $2, $5}'
echo ""

# Check memory
echo "=== Memory Usage ==="
free -h | awk 'NR==2{printf "Used: %s / %s (%.2f%%)\n", $3, $2, $3*100/$2}'
echo ""

# Check CPU
echo "=== CPU Load ==="
uptime | awk -F'load average:' '{print "Load Average:" $2}'
echo ""

# Check services
echo "=== Services Status ==="
check_service nginx
check_service php8.2-fpm
check_service mysql
check_service redis-server
check_service supervisor
echo ""

# Check if directories exist
echo "=== Application Directories ==="
if [ -d "/var/www/6ammart/backend" ]; then
    echo -e "${GREEN}✓${NC} Backend directory exists"
else
    echo -e "${RED}✗${NC} Backend directory NOT found"
fi

if [ -d "/var/www/6ammart/frontend" ]; then
    echo -e "${GREEN}✓${NC} Frontend directory exists"
else
    echo -e "${RED}✗${NC} Frontend directory NOT found"
fi
echo ""

# Check database
echo "=== Database Status ==="
if systemctl is-active --quiet mysql; then
    if mysql -u root -e "USE 6ammart_db;" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Database '6ammart_db' exists"

        # Count tables
        TABLE_COUNT=$(mysql -u root -e "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = '6ammart_db';" -s -N 2>/dev/null)
        echo "  Tables: $TABLE_COUNT"
    else
        echo -e "${YELLOW}⚠${NC} Database '6ammart_db' not found (may need password)"
    fi
else
    echo -e "${RED}✗${NC} MySQL is not running"
fi
echo ""

# Check network ports
echo "=== Network Ports ==="
check_port() {
    local port=$1
    local service=$2
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo -e "${GREEN}✓${NC} Port $port is open ($service)"
    else
        echo -e "${RED}✗${NC} Port $port is NOT listening ($service)"
    fi
}

check_port 80 "Frontend"
check_port 8080 "Backend"
check_port 3306 "MySQL"
check_port 6379 "Redis"
echo ""

# Check Laravel
if [ -f "/var/www/6ammart/backend/artisan" ]; then
    echo "=== Laravel Backend ==="
    cd /var/www/6ammart/backend

    # Check if .env exists
    if [ -f ".env" ]; then
        echo -e "${GREEN}✓${NC} .env file exists"
    else
        echo -e "${RED}✗${NC} .env file NOT found"
    fi

    # Check storage permissions
    if [ -w "storage" ]; then
        echo -e "${GREEN}✓${NC} Storage directory is writable"
    else
        echo -e "${RED}✗${NC} Storage directory is NOT writable"
    fi

    # Check if vendor exists
    if [ -d "vendor" ]; then
        echo -e "${GREEN}✓${NC} Composer dependencies installed"
    else
        echo -e "${RED}✗${NC} Composer dependencies NOT installed"
    fi
    echo ""
fi

# Check Flutter web
if [ -f "/var/www/6ammart/frontend/index.html" ]; then
    echo "=== Flutter Frontend ==="
    echo -e "${GREEN}✓${NC} Flutter web app is deployed"

    # Check file count
    FILE_COUNT=$(find /var/www/6ammart/frontend -type f | wc -l)
    echo "  Total files: $FILE_COUNT"
else
    echo "=== Flutter Frontend ==="
    echo -e "${RED}✗${NC} Flutter web app NOT deployed"
fi
echo ""

# Check queue workers
echo "=== Queue Workers ==="
if [ -f "/etc/supervisor/conf.d/6ammart-worker.conf" ]; then
    echo -e "${GREEN}✓${NC} Supervisor configuration exists"
    sudo supervisorctl status | grep 6ammart || echo -e "${YELLOW}⚠${NC} No workers configured yet"
else
    echo -e "${YELLOW}⚠${NC} Queue workers not configured yet"
fi
echo ""

# Check recent logs
echo "=== Recent Errors ==="
if [ -f "/var/www/6ammart/backend/storage/logs/laravel.log" ]; then
    ERROR_COUNT=$(grep -c "ERROR" /var/www/6ammart/backend/storage/logs/laravel.log 2>/dev/null || echo 0)
    echo "Laravel errors in log: $ERROR_COUNT"
fi

if [ -f "/var/log/nginx/6ammart-backend-error.log" ]; then
    ERROR_COUNT=$(wc -l < /var/log/nginx/6ammart-backend-error.log 2>/dev/null || echo 0)
    echo "Nginx backend errors: $ERROR_COUNT"
fi
echo ""

# Check SSL
echo "=== SSL Certificate ==="
if [ -d "/etc/letsencrypt/live" ]; then
    CERT_COUNT=$(find /etc/letsencrypt/live -mindepth 1 -maxdepth 1 -type d | wc -l)
    if [ $CERT_COUNT -gt 0 ]; then
        echo -e "${GREEN}✓${NC} SSL certificates installed: $CERT_COUNT"
    else
        echo -e "${YELLOW}⚠${NC} No SSL certificates found"
    fi
else
    echo -e "${YELLOW}⚠${NC} Certbot not installed or no certificates"
fi
echo ""

# URLs
echo "=== Application URLs ==="
IP=$(hostname -I | awk '{print $1}')
echo "Frontend: http://$IP"
echo "Backend:  http://$IP:8080"
echo "Admin:    http://$IP:8080/admin"
echo ""

# Quick access to logs
echo "=== View Logs ==="
echo "Laravel:       tail -f /var/www/6ammart/backend/storage/logs/laravel.log"
echo "Nginx Access:  tail -f /var/log/nginx/6ammart-backend-access.log"
echo "Nginx Error:   tail -f /var/log/nginx/6ammart-backend-error.log"
echo "PHP-FPM:       sudo journalctl -u php8.2-fpm -n 50"
echo "MySQL:         sudo journalctl -u mysql -n 50"
echo ""

echo "========================================="
echo "Status check complete!"
echo "========================================="
