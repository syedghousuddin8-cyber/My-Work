# 6amMart Deployment Scripts

Quick deployment package for deploying 6amMart to AWS Lightsail or any Ubuntu server.

## Quick Start

### Step 1: Connect to Your Server

```bash
# Save your SSH key
nano lightsail_key.pem
# Paste key and save (Ctrl+X, Y, Enter)

# Set permissions
chmod 600 lightsail_key.pem

# Connect
ssh -i lightsail_key.pem ubuntu@13.233.190.21
```

### Step 2: Upload Scripts to Server

**Option A: Clone repository on server**
```bash
git clone https://github.com/syedghousuddin8-cyber/My-Work.git
cd My-Work/deployment
chmod +x *.sh
```

**Option B: Upload from local machine**
```bash
scp -i lightsail_key.pem -r deployment/* ubuntu@13.233.190.21:~/deployment/
ssh -i lightsail_key.pem ubuntu@13.233.190.21
cd ~/deployment
chmod +x *.sh
```

### Step 3: Run Deployment Scripts in Order

**IMPORTANT: Run scripts in this exact order!**

```bash
# 1. Install all required software (PHP, MySQL, Nginx, Flutter, etc.)
sudo ./1_server_preparation.sh
# Duration: 15-20 minutes

# 2. Create database and user
./2_database_setup.sh
# Note: Save the database credentials shown at the end!

# 3. Deploy Laravel backend
./3_deploy_backend.sh
# Choose 'y' to seed database for demo data, 'n' for clean install

# 4. Build and deploy Flutter web app
./4_deploy_flutter.sh
# Enter backend URL when prompted (e.g., http://13.233.190.21:8080)

# 5. Configure Nginx web server
./5_configure_nginx.sh
# Enter domain names or press Enter to use IP address
```

### Step 4: Access Your Application

- **Frontend (Customer App):** http://13.233.190.21
- **Backend (Admin Panel):** http://13.233.190.21:8080/admin

## What Each Script Does

### 1️⃣ `1_server_preparation.sh`
Prepares server environment by installing:
- PHP 8.2 + extensions
- MySQL 8.0
- Nginx
- Node.js 20.x
- Flutter SDK 3.35.6
- Redis, Supervisor
- Configures firewall

### 2️⃣ `2_database_setup.sh`
- Creates database: `6ammart_db`
- Creates secure database user
- Optimizes MySQL configuration
- Saves credentials to `/var/www/6ammart/db_credentials.txt`

### 3️⃣ `3_deploy_backend.sh`
- Clones 6am repository
- Extracts Laravel admin panel
- Installs Composer dependencies
- Configures environment
- Runs database migrations
- Caches configuration

### 4️⃣ `4_deploy_flutter.sh`
- Clones repository
- Extracts Flutter app
- Configures API endpoint
- Builds web application (takes 10-20 min)
- Deploys to production directory

### 5️⃣ `5_configure_nginx.sh`
- Configures Nginx for frontend (port 80)
- Configures Nginx for backend (port 8080)
- Sets up PHP-FPM
- Enables sites and restarts services

## Files Included

```
deployment/
├── 1_server_preparation.sh      # Server setup
├── 2_database_setup.sh           # Database configuration
├── 3_deploy_backend.sh           # Laravel deployment
├── 4_deploy_flutter.sh           # Flutter web build
├── 5_configure_nginx.sh          # Web server setup
├── .env.production.template      # Environment template
├── github-actions-deploy.yml     # CI/CD workflow
├── DEPLOYMENT_GUIDE.md           # Full documentation
└── README.md                     # This file
```

## Server Information

- **IP:** 13.233.190.21
- **Username:** ubuntu
- **OS:** Ubuntu (Lightsail)
- **Minimum RAM:** 2GB (4GB recommended)
- **Minimum Storage:** 40GB

## Port Configuration

| Service | Port | Access |
|---------|------|--------|
| Frontend (User App) | 80 | Public |
| Backend (Admin/API) | 8080 | Public |
| MySQL | 3306 | Localhost only |
| Redis | 6379 | Localhost only |
| SSH | 22 | Restricted |

## Post-Deployment Tasks

### 1. Configure SSL (HTTPS)
```bash
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

### 2. Update Laravel .env
```bash
sudo nano /var/www/6ammart/backend/.env
```

Configure:
- Firebase keys
- Google Maps API
- Payment gateways
- Email service
- Social login

### 3. Set Up Queue Workers
```bash
sudo nano /etc/supervisor/conf.d/6ammart-worker.conf
# See DEPLOYMENT_GUIDE.md for configuration
sudo supervisorctl reread && sudo supervisorctl update
```

### 4. Set Up Cron Jobs
```bash
sudo crontab -e -u www-data
# Add: * * * * * cd /var/www/6ammart/backend && php artisan schedule:run >> /dev/null 2>&1
```

## Troubleshooting

### Issue: Script fails with "Permission denied"
```bash
chmod +x *.sh
```

### Issue: Can't access application
```bash
# Check firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 8080/tcp

# Check services
sudo systemctl status nginx php8.2-fpm mysql
```

### Issue: Laravel errors
```bash
cd /var/www/6ammart/backend
sudo -u www-data php artisan cache:clear
sudo -u www-data php artisan config:clear

# Check logs
tail -f storage/logs/laravel.log
```

### Issue: Database connection failed
```bash
# Check credentials
cat /var/www/6ammart/db_credentials.txt
grep DB_ /var/www/6ammart/backend/.env

# Test connection
mysql -u 6ammart_user -p 6ammart_db
```

## GitHub Actions Deployment (Optional)

To enable automated deployment on git push:

1. Copy `github-actions-deploy.yml` to `.github/workflows/`
2. Add secrets to your GitHub repository:
   - `SERVER_HOST`: 13.233.190.21
   - `SERVER_USER`: ubuntu
   - `SSH_PRIVATE_KEY`: Your Lightsail SSH key

3. Push to main/production branch to trigger deployment

## Useful Commands

```bash
# Restart all services
sudo systemctl restart nginx php8.2-fpm mysql redis-server

# Check logs
tail -f /var/www/6ammart/backend/storage/logs/laravel.log
tail -f /var/log/nginx/6ammart-backend-error.log

# Clear Laravel cache
cd /var/www/6ammart/backend
php artisan optimize:clear

# Rebuild Flutter web
cd /var/www/6ammart/flutter_app
flutter clean && flutter pub get && flutter build web --release
sudo cp -r build/web/* /var/www/6ammart/frontend/
```

## Directory Structure After Deployment

```
/var/www/6ammart/
├── backend/                # Laravel admin panel
│   ├── app/
│   ├── public/            # Backend public files
│   ├── storage/
│   └── .env               # Configuration
├── frontend/              # Flutter web (built)
│   ├── index.html
│   ├── assets/
│   └── flutter_service_worker.js
├── flutter_app/           # Flutter source
└── db_credentials.txt     # Database credentials (secure this!)
```

## Security Checklist

After deployment:

- [ ] Change default admin password
- [ ] Install SSL certificate
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Secure database credentials file
- [ ] Configure firewall properly
- [ ] Set up automated backups
- [ ] Configure monitoring
- [ ] Review file permissions
- [ ] Update all API keys
- [ ] Enable rate limiting

## Support

- **Full Documentation:** See `DEPLOYMENT_GUIDE.md`
- **6amMart Docs:** https://6ammart.app/documentation/
- **Laravel Docs:** https://laravel.com/docs
- **Flutter Docs:** https://flutter.dev/docs

## Estimated Deployment Time

- Server preparation: 15-20 minutes
- Database setup: 2-3 minutes
- Backend deployment: 10-15 minutes
- Flutter build: 10-20 minutes
- Nginx configuration: 2-3 minutes
- **Total: 40-60 minutes**

## Next Steps

1. ✅ Run deployment scripts
2. ✅ Configure SSL certificate
3. ✅ Update environment variables
4. ✅ Set up domain names
5. ✅ Configure third-party services
6. ✅ Build mobile apps (separate process)
7. ✅ Test thoroughly
8. ✅ Launch!

---

**Created:** November 2025
**Last Updated:** November 2025
**Version:** 1.0

For detailed information, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
