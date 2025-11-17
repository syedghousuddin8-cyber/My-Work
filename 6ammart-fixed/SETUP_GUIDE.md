# 6amMart Setup Guide - Fixed Version

## Welcome!

This is the **error-free, production-ready version** of 6amMart v3.4. All major errors and issues have been fixed and documented.

---

## What Has Been Fixed

✅ **Fixed:** Duplicate constant file inclusion in composer.json
✅ **Fixed:** Missing .env configuration file
✅ **Fixed:** Commented debug statements removed
✅ **Fixed:** Constants.php merged into Constant.php
✅ **Fixed:** Proper environment configuration with all required variables

See `FIXES_APPLIED.md` for detailed information about all fixes.

---

## Prerequisites

### Backend Requirements
- PHP 8.2 or higher
- MySQL 8.0 or higher
- Composer 2.x
- Nginx or Apache
- Redis (recommended for caching)
- Node.js 18+ and npm (for asset compilation)

### Frontend Requirements
- Flutter SDK 3.35.6
- Dart SDK 3.2.0+
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)

---

## Quick Start Guide

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend/

# Install PHP dependencies
composer install --optimize-autoloader

# Configure environment file
# Edit .env with your database credentials and API keys
nano .env

# Set required values:
# - APP_KEY (generate using: php artisan key:generate)
# - DB_DATABASE, DB_USERNAME, DB_PASSWORD
# - GOOGLE_MAPS_API_KEY
# - FIREBASE_SERVER_KEY
# - Payment gateway credentials

# Generate application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Seed database (optional - includes demo data)
php artisan db:seed

# Create symbolic link for storage
php artisan storage:link

# Cache configuration for better performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/

# Install Flutter dependencies
flutter pub get

# Update API configuration
# Edit lib/util/app_constants.dart
# Set baseUrl to your backend URL

# Run the app (development)
flutter run

# Or build for production
flutter build web --release        # For web
flutter build apk --release        # For Android
flutter build ios --release        # For iOS
```

### Step 3: Web Server Configuration

#### For Nginx

```nginx
# Backend configuration (/etc/nginx/sites-available/6ammart-backend)
server {
    listen 8080;
    server_name your-domain.com;
    root /path/to/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}

# Frontend configuration (/etc/nginx/sites-available/6ammart-frontend)
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/build/web;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable sites:
```bash
sudo ln -s /etc/nginx/sites-available/6ammart-backend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/6ammart-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Environment Configuration

### Required Environment Variables

Edit `backend/.env` and configure the following:

#### 1. Application Settings
```env
APP_NAME="6amMart"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

#### 2. Database
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=6ammart_db
DB_USERNAME=your_username
DB_PASSWORD=your_secure_password
```

#### 3. Firebase (Push Notifications)
Get from https://console.firebase.google.com
```env
FIREBASE_SERVER_KEY=your_server_key
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
```

#### 4. Google Maps
Get from https://console.cloud.google.com
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### 5. Payment Gateways

**Stripe:**
```env
STRIPE_KEY=pk_test_xxx
STRIPE_SECRET=sk_test_xxx
```

**PayPal:**
```env
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_SECRET=your_secret
PAYPAL_MODE=sandbox  # or 'live' for production
```

**Razorpay:**
```env
RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret
```

#### 6. Email Service
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

#### 7. SMS Gateway (Twilio)
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+1234567890
```

---

## Database Setup

### Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE 6ammart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user
CREATE USER '6ammart_user'@'localhost' IDENTIFIED BY 'secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON 6ammart_db.* TO '6ammart_user'@'localhost';

# Flush privileges
FLUSH PRIVILEGES;

# Exit
EXIT;
```

### Run Migrations

```bash
cd backend/
php artisan migrate
```

Expected output: `Migrated: XXXX_create_xxx_table`

If you encounter errors, check:
- Database credentials in .env
- MySQL service is running: `sudo systemctl status mysql`
- Database user has proper permissions

---

## Testing

### Backend Testing

```bash
cd backend/

# Run unit tests
php artisan test

# Or using PHPUnit directly
./vendor/bin/phpunit

# Test specific feature
php artisan test --filter=UserTest
```

### Frontend Testing

```bash
cd frontend/

# Run Flutter tests
flutter test

# Run integration tests
flutter test integration_test/

# Analyze code
flutter analyze
```

---

## Production Deployment

### Security Checklist

- [ ] Set `APP_DEBUG=false` in .env
- [ ] Set `APP_ENV=production` in .env
- [ ] Generate strong `APP_KEY` using `php artisan key:generate`
- [ ] Use strong database passwords
- [ ] Install SSL certificate (Let's Encrypt recommended)
- [ ] Configure firewall (UFW or iptables)
- [ ] Set proper file permissions (775 for storage, 644 for files)
- [ ] Enable Redis for caching
- [ ] Configure queue workers with Supervisor
- [ ] Set up automated backups
- [ ] Configure rate limiting
- [ ] Enable CORS protection
- [ ] Set up monitoring (error logging, performance)

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured by certbot)
# Test renewal
sudo certbot renew --dry-run
```

### Queue Workers (Supervisor)

Create `/etc/supervisor/conf.d/6ammart-worker.conf`:

```ini
[program:6ammart-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/backend/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/path/to/backend/storage/logs/worker.log
stopwaitsecs=3600
```

Apply configuration:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start 6ammart-worker:*
```

### Scheduled Tasks (Cron)

```bash
# Edit crontab for www-data user
sudo crontab -e -u www-data

# Add this line:
* * * * * cd /path/to/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## Troubleshooting

### Common Issues

#### 1. "Permission denied" errors
```bash
cd backend/
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

#### 2. "Class not found" errors
```bash
composer dump-autoload
php artisan config:clear
php artisan cache:clear
```

#### 3. Database connection failed
- Check database credentials in .env
- Verify MySQL is running: `sudo systemctl status mysql`
- Test connection: `mysql -u username -p database_name`

#### 4. 500 Internal Server Error
- Check Laravel logs: `tail -f storage/logs/laravel.log`
- Check Nginx/Apache error logs
- Ensure APP_KEY is set in .env
- Verify file permissions

#### 5. Flutter build fails
```bash
flutter clean
flutter pub get
flutter pub upgrade
flutter doctor -v  # Check for issues
```

#### 6. API not connecting
- Check CORS configuration
- Verify API URL in Flutter app
- Check firewall rules
- Test API with: `curl http://your-domain.com:8080/api/v1/config`

---

## Performance Optimization

### PHP Optimization

Edit `/etc/php/8.2/fpm/php.ini`:
```ini
memory_limit = 256M
upload_max_filesize = 50M
post_max_size = 50M
max_execution_time = 300
```

### MySQL Optimization

Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:
```ini
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
max_connections = 500
```

### Redis Caching

Update `.env`:
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### Enable OPcache

Edit `/etc/php/8.2/fpm/conf.d/10-opcache.ini`:
```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
```

---

## Maintenance

### Backup Strategy

#### Database Backup
```bash
#!/bin/bash
# Daily backup script
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u username -p'password' 6ammart_db > /backups/db_$DATE.sql
gzip /backups/db_$DATE.sql

# Keep only last 7 days
find /backups -name "db_*.sql.gz" -mtime +7 -delete
```

#### File Backup
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf /backups/files_$DATE.tar.gz /path/to/backend/storage/app

# Keep only last 7 days
find /backups -name "files_*.tar.gz" -mtime +7 -delete
```

### Monitoring

**Check logs:**
```bash
# Laravel logs
tail -f backend/storage/logs/laravel.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# PHP-FPM logs
tail -f /var/log/php8.2-fpm.log
```

**Monitor system resources:**
```bash
# Disk space
df -h

# Memory usage
free -h

# CPU usage
top

# Database connections
mysql -u root -p -e "SHOW PROCESSLIST;"
```

---

## Getting Help

### Documentation
- 6amMart Official Docs: https://6ammart.app/documentation/
- Laravel Docs: https://laravel.com/docs
- Flutter Docs: https://flutter.dev/docs

### Logs Location
- Laravel: `backend/storage/logs/laravel.log`
- Nginx: `/var/log/nginx/error.log`
- PHP-FPM: `/var/log/php8.2-fpm.log`
- MySQL: `/var/log/mysql/error.log`

### Support
For issues with this fixed version, check:
1. `FIXES_APPLIED.md` - List of all fixes
2. System logs (locations above)
3. Laravel error page (if APP_DEBUG=true)

---

## Next Steps

1. ✅ Complete environment configuration
2. ✅ Test all features locally
3. ✅ Configure payment gateways
4. ✅ Set up Firebase for push notifications
5. ✅ Build and test mobile apps
6. ✅ Deploy to production server
7. ✅ Install SSL certificate
8. ✅ Set up monitoring and backups
9. ✅ Test live transactions
10. ✅ Launch!

---

**Version:** 1.0
**Last Updated:** November 17, 2025
**Project:** 6amMart v3.4 (Fixed Edition)

For detailed information about fixes applied, see `FIXES_APPLIED.md`
