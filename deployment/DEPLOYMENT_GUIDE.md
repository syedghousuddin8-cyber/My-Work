# 6amMart Deployment Guide

## Complete Deployment Guide for AWS Lightsail

This guide will help you deploy the 6amMart multi-vendor delivery platform on AWS Lightsail (Ubuntu).

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Information](#server-information)
3. [Deployment Steps](#deployment-steps)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Troubleshooting](#troubleshooting)
6. [Maintenance](#maintenance)

---

## Prerequisites

### Local Machine Requirements
- SSH client installed
- Git installed
- Basic understanding of Linux commands

### Server Requirements
- AWS Lightsail instance running Ubuntu 20.04/22.04
- Minimum 2GB RAM (4GB recommended)
- Minimum 40GB storage
- SSH access to the server

### Third-party Services (for production)
- Domain name (optional but recommended)
- Firebase account (for push notifications)
- Google Maps API key
- Payment gateway accounts (Stripe, PayPal, Razorpay, etc.)
- Email service (SendGrid, Mailgun, AWS SES, etc.)

---

## Server Information

**IP Address:** 13.233.190.21
**Username:** ubuntu
**SSH Key:** Located in your Lightsail account
**OS:** Ubuntu (Lightsail)

---

## Deployment Steps

### Step 1: Connect to Your Server

From your local machine, save the SSH key and connect:

```bash
# Save the SSH key to a file
nano lightsail_key.pem
# Paste the key provided earlier
# Save and exit (Ctrl+X, Y, Enter)

# Set proper permissions
chmod 600 lightsail_key.pem

# Connect to server
ssh -i lightsail_key.pem ubuntu@13.233.190.21
```

### Step 2: Upload Deployment Scripts

From your local machine, upload the deployment scripts to the server:

```bash
# From the My-Work/deployment directory on your local machine
scp -i lightsail_key.pem -r deployment/* ubuntu@13.233.190.21:~/deployment/
```

Alternatively, clone this repository on the server:

```bash
# On the server
cd ~
git clone https://github.com/syedghousuddin8-cyber/My-Work.git
cd My-Work/deployment
```

### Step 3: Make Scripts Executable

```bash
chmod +x *.sh
```

### Step 4: Run Server Preparation Script

This script installs all required software (PHP, MySQL, Nginx, Node.js, Flutter, etc.):

```bash
sudo ./1_server_preparation.sh
```

**Duration:** 15-20 minutes

**What it does:**
- Updates system packages
- Installs PHP 8.2 and extensions
- Installs MySQL 8.0
- Installs Nginx web server
- Installs Node.js 20.x
- Installs Flutter SDK
- Installs Redis and Supervisor
- Configures firewall

### Step 5: Set Up Database

This script creates the database and user:

```bash
./2_database_setup.sh
```

**What to provide:**
- MySQL root password (you'll be prompted)

**What it does:**
- Creates database: `6ammart_db`
- Creates database user with secure password
- Optimizes MySQL configuration
- Saves credentials to `/var/www/6ammart/db_credentials.txt`

**IMPORTANT:** Note down the database credentials displayed at the end!

### Step 6: Deploy Laravel Backend

This script deploys the Laravel admin panel:

```bash
./3_deploy_backend.sh
```

**Duration:** 10-15 minutes

**What it does:**
- Clones the 6am repository
- Extracts admin panel files
- Installs Composer dependencies
- Configures `.env` file
- Generates application key
- Runs database migrations
- Caches configuration

**Note:** When prompted to seed the database, enter 'y' if you want sample data, 'n' for a clean install.

### Step 7: Deploy Flutter Web Application

This script builds and deploys the Flutter web app:

```bash
./4_deploy_flutter.sh
```

**Duration:** 10-20 minutes (Flutter build takes time)

**What to provide:**
- Backend API URL (e.g., `http://13.233.190.21:8080` or your domain)

**What it does:**
- Clones the repository
- Extracts Flutter app files
- Configures API endpoint
- Installs Flutter dependencies
- Builds web application
- Deploys to `/var/www/6ammart/frontend`

### Step 8: Configure Nginx

This script configures the web server:

```bash
./5_configure_nginx.sh
```

**What to provide:**
- Frontend domain (or press Enter to use IP address)
- Backend domain (or press Enter to use IP address)

**What it does:**
- Creates Nginx configuration for frontend (port 80)
- Creates Nginx configuration for backend (port 8080)
- Configures PHP-FPM
- Enables sites
- Restarts services

### Step 9: Verify Deployment

Check if all services are running:

```bash
# Check Nginx
sudo systemctl status nginx

# Check PHP-FPM
sudo systemctl status php8.2-fpm

# Check MySQL
sudo systemctl status mysql

# Check Redis
sudo systemctl status redis-server

# Test backend
curl http://localhost:8080

# Test frontend
curl http://localhost
```

### Step 10: Access Your Application

1. **Frontend (User App):**
   - URL: `http://13.233.190.21`
   - Or: `http://your-domain.com` (if configured)

2. **Backend (Admin Panel):**
   - URL: `http://13.233.190.21:8080/admin`
   - Or: `http://api.your-domain.com/admin` (if configured)

---

## Post-Deployment Configuration

### 1. Configure Environment Variables

Edit the Laravel `.env` file:

```bash
sudo nano /var/www/6ammart/backend/.env
```

**Essential configurations:**

```env
# Application
APP_NAME="6amMart"
APP_URL=http://your-domain.com

# Database (already configured)
DB_DATABASE=6ammart_db
DB_USERNAME=6ammart_user
DB_PASSWORD=your_password

# Firebase (for push notifications)
FIREBASE_SERVER_KEY=your_key_here

# Google Maps
GOOGLE_MAPS_API_KEY=your_key_here

# Payment Gateways
STRIPE_KEY=your_key
STRIPE_SECRET=your_secret
PAYPAL_CLIENT_ID=your_id
RAZORPAY_KEY=your_key

# Email
MAIL_MAILER=smtp
MAIL_HOST=smtp.your-provider.com
MAIL_PORT=587
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

After editing, clear cache:

```bash
cd /var/www/6ammart/backend
sudo -u www-data php artisan config:clear
sudo -u www-data php artisan config:cache
```

### 2. Set Up SSL Certificate (HTTPS)

For production, always use SSL:

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx -y

# Obtain certificate (replace with your domains)
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal:
sudo certbot renew --dry-run
```

### 3. Configure Queue Workers

For background jobs (emails, notifications, etc.):

```bash
# Create supervisor configuration
sudo nano /etc/supervisor/conf.d/6ammart-worker.conf
```

Add:

```ini
[program:6ammart-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/6ammart/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/6ammart/backend/storage/logs/worker.log
stopwaitsecs=3600
```

Then:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start 6ammart-worker:*
```

### 4. Set Up Scheduled Tasks (Cron)

Laravel scheduler for automated tasks:

```bash
sudo crontab -e -u www-data
```

Add:

```cron
* * * * * cd /var/www/6ammart/backend && php artisan schedule:run >> /dev/null 2>&1
```

### 5. Configure Firebase for Mobile Apps

1. Create Firebase project at https://console.firebase.google.com
2. Add Android and iOS apps
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Update Firebase configuration in Flutter app
5. Rebuild mobile apps

### 6. Configure Google Maps

1. Go to https://console.cloud.google.com
2. Create a project or select existing
3. Enable APIs:
   - Maps JavaScript API
   - Maps SDK for Android
   - Maps SDK for iOS
   - Geocoding API
   - Places API
4. Create API key with restrictions
5. Update in both Laravel `.env` and Flutter app

### 7. Admin Panel First Login

1. Visit: `http://your-domain.com:8080/admin`
2. Default credentials are usually in the documentation or database seeder
3. **IMMEDIATELY change the default password!**
4. Configure basic settings:
   - Business information
   - Currency and timezone
   - Payment methods
   - Delivery zones
   - Commission rates

---

## Troubleshooting

### Issue: Cannot access backend or frontend

**Check Nginx:**
```bash
sudo nginx -t
sudo systemctl status nginx
sudo journalctl -u nginx -n 50
```

**Check firewall:**
```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 8080/tcp
```

### Issue: Laravel showing errors

**Check logs:**
```bash
tail -f /var/www/6ammart/backend/storage/logs/laravel.log
```

**Check permissions:**
```bash
cd /var/www/6ammart/backend
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

**Clear all caches:**
```bash
cd /var/www/6ammart/backend
sudo -u www-data php artisan cache:clear
sudo -u www-data php artisan config:clear
sudo -u www-data php artisan route:clear
sudo -u www-data php artisan view:clear
```

### Issue: Database connection failed

**Check MySQL status:**
```bash
sudo systemctl status mysql
```

**Test connection:**
```bash
mysql -u 6ammart_user -p 6ammart_db
```

**Check credentials in .env:**
```bash
grep DB_ /var/www/6ammart/backend/.env
```

### Issue: Flutter web app not loading

**Check build output:**
```bash
ls -la /var/www/6ammart/frontend/
```

**Check browser console for errors**

**Rebuild Flutter app:**
```bash
cd /var/www/6ammart/flutter_app
flutter clean
flutter pub get
flutter build web --release
sudo cp -r build/web/* /var/www/6ammart/frontend/
```

### Issue: 502 Bad Gateway

**Check PHP-FPM:**
```bash
sudo systemctl status php8.2-fpm
sudo journalctl -u php8.2-fpm -n 50
```

**Restart PHP-FPM:**
```bash
sudo systemctl restart php8.2-fpm
```

---

## Maintenance

### Regular Updates

**Update Laravel dependencies:**
```bash
cd /var/www/6ammart/backend
sudo -u www-data composer update
sudo -u www-data php artisan migrate
sudo -u www-data php artisan config:cache
```

**Update system packages:**
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### Backup Strategy

**Database backup:**
```bash
# Create backup
sudo mysqldump -u root -p 6ammart_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
mysql -u root -p 6ammart_db < backup_file.sql
```

**Files backup:**
```bash
# Backup uploads and storage
sudo tar -czf storage_backup_$(date +%Y%m%d).tar.gz /var/www/6ammart/backend/storage/app
```

**Automated backups:**
```bash
# Create backup script
sudo nano /usr/local/bin/backup-6ammart.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u root -p'your_root_password' 6ammart_db > $BACKUP_DIR/db_$DATE.sql

# Files backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/6ammart/backend/storage/app

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Make executable and add to cron:
```bash
sudo chmod +x /usr/local/bin/backup-6ammart.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-6ammart.sh
```

### Monitoring

**Check disk space:**
```bash
df -h
```

**Check memory usage:**
```bash
free -h
```

**Check CPU usage:**
```bash
htop
```

**Monitor logs:**
```bash
# Laravel logs
tail -f /var/www/6ammart/backend/storage/logs/laravel.log

# Nginx access logs
tail -f /var/log/nginx/6ammart-backend-access.log

# Nginx error logs
tail -f /var/log/nginx/6ammart-backend-error.log
```

### Performance Optimization

**Enable OPcache:**
```bash
sudo nano /etc/php/8.2/fpm/conf.d/10-opcache.ini
```

Add:
```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
opcache.revalidate_freq=60
opcache.fast_shutdown=1
```

**Configure Redis cache:**
In `.env`:
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

---

## Security Checklist

- [ ] Changed default admin password
- [ ] SSL certificate installed
- [ ] Firewall configured (UFW)
- [ ] Database accessible only from localhost
- [ ] File permissions properly set (755 for directories, 644 for files)
- [ ] Storage and cache directories writable (775)
- [ ] `.env` file protected (600 permissions)
- [ ] Disabled directory listing in Nginx
- [ ] Enabled security headers in Nginx
- [ ] Configured rate limiting
- [ ] Set up automated backups
- [ ] Configured monitoring/alerts
- [ ] Updated all default passwords
- [ ] Reviewed and configured all API keys
- [ ] Set APP_DEBUG=false in production

---

## Useful Commands

```bash
# Restart all services
sudo systemctl restart nginx php8.2-fpm mysql redis-server

# Check all services status
sudo systemctl status nginx php8.2-fpm mysql redis-server

# View Laravel logs in real-time
tail -f /var/www/6ammart/backend/storage/logs/laravel.log

# Clear all Laravel caches
cd /var/www/6ammart/backend
php artisan optimize:clear

# Run migrations
php artisan migrate

# Create admin user (if needed)
php artisan tinker
>>> User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => bcrypt('password')]);

# Check queue workers
sudo supervisorctl status

# Restart queue workers
sudo supervisorctl restart 6ammart-worker:*
```

---

## Support

For issues specific to:
- **6amMart platform**: Check official documentation at https://6ammart.app/documentation/
- **Server/deployment issues**: Review logs and this guide
- **Laravel issues**: https://laravel.com/docs
- **Flutter issues**: https://flutter.dev/docs

---

## Next Steps

1. Complete the deployment using the numbered scripts
2. Configure SSL certificate
3. Set up domain names
4. Configure third-party services (Firebase, Google Maps, Payment gateways)
5. Build and publish mobile apps (Android/iOS)
6. Test all features thoroughly
7. Set up monitoring and backups
8. Launch!

---

**Deployment Scripts Location:** `/home/user/My-Work/deployment/`

**Created:** November 2025
**Version:** 1.0
