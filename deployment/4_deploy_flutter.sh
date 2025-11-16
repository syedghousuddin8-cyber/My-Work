#!/bin/bash
# 6amMart Flutter Web Deployment Script

set -e  # Exit on error

echo "========================================="
echo "6amMart Flutter Web Deployment"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/6ammart"
FLUTTER_DIR="$APP_DIR/flutter_app"
WEB_DIR="$APP_DIR/frontend"
REPO_URL="https://github.com/syedghousuddin8-cyber/6am.git"

# Add Flutter to PATH
export PATH="$PATH:/opt/flutter/bin"

# Clone repository
echo -e "${GREEN}[1/10] Cloning 6amMart repository...${NC}"
cd /tmp
if [ -d "6am" ]; then
    rm -rf 6am
fi
git clone $REPO_URL
cd 6am

# Extract the Flutter app
echo -e "${GREEN}[2/10] Extracting Flutter app files...${NC}"
cd "6mamart-3.4-Momux-in-Mehedi/Main-6ammart-3.4-Momux/Main/User app and web"

# Copy to build directory
echo -e "${GREEN}[3/10] Copying files to $FLUTTER_DIR...${NC}"
sudo mkdir -p $FLUTTER_DIR
sudo cp -r ./* $FLUTTER_DIR/
sudo chown -R $USER:$USER $FLUTTER_DIR

# Configure Flutter for web
echo -e "${GREEN}[4/10] Configuring Flutter for web...${NC}"
cd $FLUTTER_DIR
flutter config --enable-web

# Update API endpoint in Flutter app
echo -e "${YELLOW}[5/10] Please enter your backend API URL (e.g., https://api.yourdomain.com):${NC}"
read -p "API URL: " API_URL

if [ -z "$API_URL" ]; then
    API_URL="http://13.233.190.21"
    echo -e "${YELLOW}Using default: $API_URL${NC}"
fi

# Update the API endpoint in the Flutter app
# Note: This assumes there's a constants or config file. You may need to adjust this path.
if [ -f "lib/util/app_constants.dart" ]; then
    echo -e "${GREEN}Updating API endpoint in app_constants.dart...${NC}"
    # This is a simple replacement - you may need to adjust based on actual file structure
    sudo sed -i "s|http://.*|$API_URL|g" lib/util/app_constants.dart
fi

# Clean Flutter project
echo -e "${GREEN}[6/10] Cleaning Flutter project...${NC}"
flutter clean

# Get dependencies
echo -e "${GREEN}[7/10] Installing Flutter dependencies...${NC}"
flutter pub get

# Build web app
echo -e "${GREEN}[8/10] Building Flutter web application (this may take several minutes)...${NC}"
flutter build web --release --web-renderer html

# Deploy web files
echo -e "${GREEN}[9/10] Deploying web files...${NC}"
sudo mkdir -p $WEB_DIR
sudo cp -r build/web/* $WEB_DIR/
sudo chown -R www-data:www-data $WEB_DIR

# Create web configuration file
echo -e "${GREEN}[10/10] Creating web configuration...${NC}"
sudo tee $WEB_DIR/config.json > /dev/null <<EOF
{
  "apiUrl": "$API_URL",
  "environment": "production",
  "appName": "6amMart"
}
EOF

# Set permissions
sudo chmod -R 755 $WEB_DIR
sudo chown -R www-data:www-data $WEB_DIR

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Flutter web app deployed successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Flutter source: $FLUTTER_DIR"
echo "Web files: $WEB_DIR"
echo "API URL: $API_URL"
echo ""
echo "Build output:"
ls -lh $WEB_DIR/
echo ""
echo "Next steps:"
echo "1. Configure Nginx to serve the web app (script 5_configure_nginx.sh)"
echo "2. Set up SSL certificate"
echo "3. Test the application"
