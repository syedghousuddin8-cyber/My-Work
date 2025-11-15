# Admin Panel Deployment Guide

Complete guide for deploying the Admin Panel to production server.

## Server Details

- **IP Address:** 52.66.71.133
- **Username:** ubuntu
- **SSH Key:** Provided RSA private key
- **OS:** Ubuntu Linux

## Prerequisites

Before deploying, ensure you have:

1. SSH access to the server
2. The SSH private key saved locally
3. Node.js and npm installed on your local machine
4. Git repository cloned locally

## Deployment Methods

### Method 1: Automated Deployment (Recommended)

This method uses the provided deployment script to automatically build and deploy the admin panel.

#### Step 1: Save SSH Key

Save the provided SSH key to your local machine:

```bash
# Create SSH directory if it doesn't exist
mkdir -p ~/.ssh

# Save the key (paste the provided key)
nano ~/.ssh/deploy_key

# Set proper permissions
chmod 600 ~/.ssh/deploy_key
```

#### Step 2: Run Deployment Script

```bash
cd delivery-platform/deployment/production
chmod +x deploy-admin-panel.sh
./deploy-admin-panel.sh
```

The script will:
- Build the admin panel locally
- Create a production build
- Transfer files to the server
- Set up nginx
- Configure the server
- Verify deployment

#### Step 3: Access Admin Panel

Once deployment is complete, access the admin panel at:
- **URL:** http://52.66.71.133
- **Default Email:** admin@delivery-platform.com
- **Default Password:** admin123

**IMPORTANT:** Change the default password immediately after first login!

---

### Method 2: Manual Deployment

If the automated script doesn't work, follow these manual steps:

#### Step 1: Build Admin Panel Locally

```bash
cd delivery-platform/admin-dashboard

# Install dependencies
npm install

# Create production environment file
cat > .env.production << EOF
REACT_APP_API_URL=http://52.66.71.133/api/v1
REACT_APP_WS_URL=ws://52.66.71.133/ws
REACT_APP_ENV=production
EOF

# Build for production
npm run build
```

#### Step 2: Transfer Files to Server

```bash
# Create archive
cd build
tar -czf admin-panel.tar.gz .

# Transfer to server
scp -i ~/.ssh/deploy_key admin-panel.tar.gz ubuntu@52.66.71.133:/tmp/
scp -i ~/.ssh/deploy_key ../deployment/production/nginx-admin.conf ubuntu@52.66.71.133:/tmp/
scp -i ~/.ssh/deploy_key ../deployment/production/server-setup.sh ubuntu@52.66.71.133:/tmp/
```

#### Step 3: Connect to Server

```bash
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133
```

#### Step 4: Run Server Setup

```bash
# Make setup script executable
chmod +x /tmp/server-setup.sh

# Run setup script
/tmp/server-setup.sh
```

#### Step 5: Deploy Admin Panel

```bash
# Create application directory
sudo mkdir -p /var/www/delivery-platform/admin-panel

# Extract files
cd /var/www/delivery-platform/admin-panel
sudo tar -xzf /tmp/admin-panel.tar.gz

# Set ownership
sudo chown -R ubuntu:ubuntu /var/www/delivery-platform
```

#### Step 6: Configure Nginx

```bash
# Copy nginx configuration
sudo cp /tmp/nginx-admin.conf /etc/nginx/sites-available/admin-panel

# Enable site
sudo ln -s /etc/nginx/sites-available/admin-panel /etc/nginx/sites-enabled/admin-panel

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

#### Step 7: Verify Deployment

```bash
# Check nginx status
sudo systemctl status nginx

# Test local access
curl http://localhost

# From your local machine
curl http://52.66.71.133
```

---

## Post-Deployment Configuration

### 1. Configure Backend Services

If you're running backend services on the same server:

```bash
# Create backend directory
mkdir -p /var/www/delivery-platform/backend

# Clone or transfer backend services
# Configure each service with proper environment variables
# Use PM2 to manage services
```

### 2. Set Up SSL Certificate (Recommended)

```bash
# Install certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain certificate (replace with your domain)
sudo certbot --nginx -d admin.delivery-platform.com

# Auto-renewal is configured automatically
```

### 3. Configure Environment Variables

Update the admin panel's API URLs if needed:

```bash
# Edit nginx configuration to proxy to your backend
sudo nano /etc/nginx/sites-available/admin-panel

# Restart nginx
sudo systemctl restart nginx
```

### 4. Set Up Monitoring

```bash
# Install monitoring tools
sudo apt-get install -y htop iotop

# Set up log rotation
sudo nano /etc/logrotate.d/nginx

# Monitor logs
tail -f /var/log/nginx/admin-panel-access.log
tail -f /var/log/nginx/admin-panel-error.log
```

---

## Troubleshooting

### Admin Panel Not Loading

1. Check nginx status:
   ```bash
   sudo systemctl status nginx
   ```

2. Check nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/admin-panel-error.log
   ```

3. Verify files are in place:
   ```bash
   ls -la /var/www/delivery-platform/admin-panel
   ```

### Connection Refused

1. Check if nginx is running:
   ```bash
   sudo systemctl restart nginx
   ```

2. Check firewall settings:
   ```bash
   sudo ufw status
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

### 502 Bad Gateway (When Backend is Running)

1. Check if backend service is running:
   ```bash
   pm2 list
   ```

2. Check backend logs:
   ```bash
   pm2 logs
   ```

3. Verify nginx proxy configuration:
   ```bash
   sudo nginx -t
   ```

### Build Errors

1. Clear node_modules and rebuild:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. Check Node.js version (should be 18+):
   ```bash
   node -v
   ```

---

## Updating the Admin Panel

To update the admin panel after code changes:

```bash
# On local machine
cd delivery-platform/deployment/production
./deploy-admin-panel.sh
```

Or manually:

```bash
# Build locally
cd admin-dashboard
npm run build

# Transfer
cd build
tar -czf admin-panel.tar.gz .
scp -i ~/.ssh/deploy_key admin-panel.tar.gz ubuntu@52.66.71.133:/tmp/

# On server
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133
cd /var/www/delivery-platform/admin-panel
sudo tar -xzf /tmp/admin-panel.tar.gz
```

---

## Security Checklist

- [ ] Change default admin password
- [ ] Set up SSL certificate
- [ ] Configure firewall rules
- [ ] Set up automatic security updates
- [ ] Configure fail2ban for SSH protection
- [ ] Set up regular backups
- [ ] Enable nginx security headers
- [ ] Review and limit API access
- [ ] Set up monitoring and alerting
- [ ] Configure rate limiting

---

## Maintenance

### Regular Tasks

1. **Monitor logs:**
   ```bash
   sudo tail -f /var/log/nginx/admin-panel-access.log
   ```

2. **Check disk space:**
   ```bash
   df -h
   ```

3. **Update system packages:**
   ```bash
   sudo apt-get update && sudo apt-get upgrade
   ```

4. **Monitor nginx performance:**
   ```bash
   sudo nginx -T | grep -i worker
   htop
   ```

### Backup

```bash
# Backup admin panel
tar -czf admin-panel-backup-$(date +%Y%m%d).tar.gz /var/www/delivery-platform/admin-panel

# Backup nginx config
sudo tar -czf nginx-config-backup-$(date +%Y%m%d).tar.gz /etc/nginx
```

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review nginx error logs
3. Check application logs
4. Verify all services are running

---

## Next Steps

After successful deployment:

1. **Test all features** in the admin panel
2. **Configure user roles** and permissions
3. **Set up backend services** if not already running
4. **Configure domain name** (if applicable)
5. **Set up SSL certificate** for HTTPS
6. **Configure monitoring** and alerts
7. **Set up automated backups**
8. **Document any custom configurations**

---

**Deployment Version:** 1.0.0
**Last Updated:** 2025-11-15
**Platform Status:** Production Ready ✅
