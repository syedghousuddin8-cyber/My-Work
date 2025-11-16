#!/bin/bash
# 6amMart Nginx Configuration Script

set -e  # Exit on error

echo "========================================="
echo "6amMart Nginx Configuration"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="/var/www/6ammart/backend"
FRONTEND_DIR="/var/www/6ammart/frontend"

# Get domain names
echo -e "${YELLOW}Enter your domain names:${NC}"
read -p "Frontend domain (e.g., 6ammart.com or use IP): " FRONTEND_DOMAIN
read -p "Backend/API domain (e.g., api.6ammart.com or use IP): " BACKEND_DOMAIN

if [ -z "$FRONTEND_DOMAIN" ]; then
    FRONTEND_DOMAIN="13.233.190.21"
    echo -e "${YELLOW}Using default IP: $FRONTEND_DOMAIN${NC}"
fi

if [ -z "$BACKEND_DOMAIN" ]; then
    BACKEND_DOMAIN="13.233.190.21"
    echo -e "${YELLOW}Using default IP: $BACKEND_DOMAIN${NC}"
fi

# Create Nginx configuration for Frontend (Flutter Web)
echo -e "${GREEN}[1/6] Creating Nginx configuration for Frontend...${NC}"
sudo tee /etc/nginx/sites-available/6ammart-frontend > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $FRONTEND_DOMAIN;

    root $FRONTEND_DIR;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Access and error logs
    access_log /var/log/nginx/6ammart-frontend-access.log;
    error_log /var/log/nginx/6ammart-frontend-error.log;
}
EOF

# Create Nginx configuration for Backend (Laravel API)
echo -e "${GREEN}[2/6] Creating Nginx configuration for Backend...${NC}"
sudo tee /etc/nginx/sites-available/6ammart-backend > /dev/null <<EOF
server {
    listen 8080;
    listen [::]:8080;
    server_name $BACKEND_DOMAIN;

    root $BACKEND_DIR/public;
    index index.php index.html;

    # Increase upload size for images and files
    client_max_body_size 50M;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_param PATH_INFO \$fastcgi_path_info;

        # Increase timeouts for long operations
        fastcgi_read_timeout 300;
        fastcgi_send_timeout 300;
    }

    # Deny access to .htaccess files
    location ~ /\.ht {
        deny all;
    }

    # Deny access to .env files
    location ~ /\.env {
        deny all;
    }

    # Optimize static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Access and error logs
    access_log /var/log/nginx/6ammart-backend-access.log;
    error_log /var/log/nginx/6ammart-backend-error.log;
}
EOF

# Enable sites
echo -e "${GREEN}[3/6] Enabling Nginx sites...${NC}"
sudo ln -sf /etc/nginx/sites-available/6ammart-frontend /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/6ammart-backend /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo -e "${GREEN}[4/6] Testing Nginx configuration...${NC}"
sudo nginx -t

# Configure PHP-FPM
echo -e "${GREEN}[5/6] Configuring PHP-FPM...${NC}"
sudo tee /etc/php/8.2/fpm/pool.d/6ammart.conf > /dev/null <<EOF
[6ammart]
user = www-data
group = www-data
listen = /var/run/php/php8.2-fpm.sock
listen.owner = www-data
listen.group = www-data
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.process_idle_timeout = 10s
pm.max_requests = 500
php_admin_value[upload_max_filesize] = 50M
php_admin_value[post_max_size] = 50M
php_admin_value[memory_limit] = 256M
php_admin_value[max_execution_time] = 300
EOF

# Restart services
echo -e "${GREEN}[6/6] Restarting Nginx and PHP-FPM...${NC}"
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Nginx configured successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Frontend URL: http://$FRONTEND_DOMAIN"
echo "Backend URL: http://$BACKEND_DOMAIN:8080"
echo ""
echo "Configuration files:"
echo "  - Frontend: /etc/nginx/sites-available/6ammart-frontend"
echo "  - Backend: /etc/nginx/sites-available/6ammart-backend"
echo "  - PHP-FPM: /etc/php/8.2/fpm/pool.d/6ammart.conf"
echo ""
echo "Log files:"
echo "  - Frontend Access: /var/log/nginx/6ammart-frontend-access.log"
echo "  - Frontend Error: /var/log/nginx/6ammart-frontend-error.log"
echo "  - Backend Access: /var/log/nginx/6ammart-backend-access.log"
echo "  - Backend Error: /var/log/nginx/6ammart-backend-error.log"
echo ""
echo "Next steps:"
echo "1. Update DNS records to point to this server"
echo "2. Install SSL certificate (use Certbot for Let's Encrypt)"
echo "3. Update Flutter app API endpoint to use the backend URL"
echo "4. Test the application"
echo ""
echo "To install SSL certificate, run:"
echo "  sudo apt-get install certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d $FRONTEND_DOMAIN -d $BACKEND_DOMAIN"
