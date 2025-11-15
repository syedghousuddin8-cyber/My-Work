# Production Deployment Scripts

Complete automation tools for deploying the entire Delivery Platform stack.

## 🚀 Quick Start (Recommended)

### Prerequisites

1. **Save SSH Key:**
   ```bash
   nano ~/.ssh/deploy_key
   # Paste the provided SSH key
   # Save and exit (Ctrl+X, Y, Enter)
   chmod 600 ~/.ssh/deploy_key
   ```

2. **Verify SSH Connection:**
   ```bash
   ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 "echo 'Connection successful'"
   ```

### Option 1: Complete Platform Deployment (All-in-One)

Deploy everything at once - admin panel, backend services, databases, and monitoring:

```bash
cd delivery-platform/deployment/production
chmod +x *.sh
./deploy-complete.sh
```

This will:
- ✓ Deploy admin panel
- ✓ Set up server infrastructure (Node.js, PM2, PostgreSQL, Redis, Docker)
- ✓ Configure databases
- ✓ Deploy all backend services
- ✓ Start services with PM2
- ✓ Set up monitoring stack (Prometheus, Grafana, AlertManager)
- ✓ Configure firewall
- ✓ Run health checks

**Time:** ~15-20 minutes

### Option 2: Step-by-Step Deployment

Deploy components individually for more control:

```bash
# 1. Deploy admin panel
./quick-deploy.sh

# 2. Test deployment
./test-deployment.sh

# 3. Deploy backend services (if needed)
# Backend services are deployed with deploy-complete.sh

# 4. Set up monitoring
./monitoring-setup.sh

# 5. Configure domain (optional)
./domain-setup.sh

# 6. Enable HTTPS (optional, requires domain)
./ssl-setup.sh

# 7. Verify everything
./test-deployment.sh
```

---

## 📁 Deployment Scripts

### Core Deployment

#### **deploy-complete.sh** ⭐ (Recommended)
Complete platform deployment in one command.

```bash
./deploy-complete.sh
```

**What it does:**
- Deploys admin panel
- Installs all server dependencies
- Sets up PostgreSQL and Redis
- Deploys backend services
- Starts PM2 processes
- Sets up monitoring
- Configures firewall

**Optional environment variables:**
```bash
export DOMAIN="admin.yourdomain.com"  # For SSL
./deploy-complete.sh
```

#### **quick-deploy.sh**
Fast deployment for admin panel only.

```bash
./quick-deploy.sh
```

**Best for:**
- Initial admin panel deployment
- Quick updates to admin panel
- Testing deployment process

---

### Infrastructure Setup

#### **server-setup.sh**
Prepares server environment (run this first if deploying manually).

```bash
./server-setup.sh
```

**Installs:**
- Node.js 20
- PM2
- PostgreSQL with PostGIS
- Redis
- Docker & Docker Compose
- Build tools

#### **ecosystem.config.js**
PM2 configuration for all 11 backend services.

**Usage on server:**
```bash
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133
cd /var/www/delivery-platform
pm2 start ecosystem.config.js
pm2 save
```

---

### SSL & Domain

#### **domain-setup.sh**
Interactive guide for DNS configuration.

```bash
./domain-setup.sh
```

**Features:**
- DNS configuration instructions
- DNS propagation testing
- Nginx configuration guide
- Supports all major domain registrars

#### **ssl-setup.sh**
Automated Let's Encrypt SSL certificate installation.

```bash
export DOMAIN="admin.yourdomain.com"
export EMAIL="admin@yourdomain.com"
./ssl-setup.sh
```

**Features:**
- Automatic certificate generation
- Nginx HTTPS configuration
- Auto-renewal setup
- Certificate verification

---

### Monitoring & Testing

#### **monitoring-setup.sh**
Deploys complete monitoring stack.

```bash
./monitoring-setup.sh
```

**Deploys:**
- Prometheus (metrics collection)
- Grafana (dashboards)
- AlertManager (alerts)
- Node Exporter (system metrics)

**Optional configuration:**
```bash
export SLACK_WEBHOOK="https://hooks.slack.com/..."
export ALERT_EMAIL="alerts@yourdomain.com"
./monitoring-setup.sh
```

#### **test-deployment.sh**
Comprehensive deployment testing and health checks.

```bash
./test-deployment.sh
```

**Tests:**
- Server connectivity
- Admin panel accessibility
- Backend services status
- Database connections
- Monitoring stack health
- Security configuration
- API endpoints
- Performance metrics

**Generates:** Test report with pass/fail status

---

## 🌐 Access Points

After deployment, access your platform:

### Admin Panel
- **HTTP:** http://52.66.71.133
- **HTTPS:** https://yourdomain.com (after SSL setup)
- **Login:** admin@delivery-platform.com / admin123

### Monitoring
- **Grafana:** http://52.66.71.133:3000 (admin/admin)
- **Prometheus:** http://52.66.71.133:9090
- **AlertManager:** http://52.66.71.133:9093

### Backend Services
- **User Service:** Port 3001
- **Restaurant Service:** Port 3002
- **Order Service:** Port 3003
- **Delivery Service:** Port 3004
- **Payment Service:** Port 3005
- **Notification Service:** Port 3006
- **Search Service:** Port 3007
- **Pricing Service:** Port 3008
- **Route Optimization:** Port 3009
- **Fraud Detection:** Port 3010
- **AI Recommendations:** Port 5000

---

## 📝 Server Details

- **IP:** 52.66.71.133
- **User:** ubuntu
- **OS:** Ubuntu Linux
- **Web Server:** Nginx
- **Process Manager:** PM2
- **Databases:** PostgreSQL, Redis
- **Containers:** Docker

### File Locations

```
/var/www/delivery-platform/
├── admin-panel/          # Frontend build
├── backend/
│   ├── services/         # Backend microservices
│   └── ai-services/      # AI recommendation service
├── monitoring/           # Prometheus, Grafana configs
├── ecosystem.config.js   # PM2 configuration
└── .env                  # Environment variables

/etc/nginx/
└── sites-available/
    └── admin-panel       # Nginx configuration

/var/log/
├── nginx/                # Nginx logs
└── delivery-platform/    # Application logs
```

---

## 🔧 Common Tasks

### View Logs

```bash
# Nginx logs
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo tail -f /var/log/nginx/error.log'

# PM2 logs (all services)
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'pm2 logs'

# Specific service
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'pm2 logs user-service'

# Monitoring logs
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'cd /var/www/delivery-platform/monitoring && docker-compose logs -f'
```

### Manage Services

```bash
# List all services
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'pm2 list'

# Restart all services
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'pm2 restart all'

# Stop specific service
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'pm2 stop user-service'

# Start specific service
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'pm2 start user-service'

# Restart nginx
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo systemctl restart nginx'
```

### Update Deployment

```bash
# Update admin panel only
./quick-deploy.sh

# Update everything
./deploy-complete.sh

# Update backend services
# 1. Build locally
cd ../../backend/services/user-service
npm run build

# 2. Transfer and restart
scp -r dist ubuntu@52.66.71.133:/var/www/delivery-platform/backend/services/user-service/
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'pm2 restart user-service'
```

### Database Management

```bash
# Connect to PostgreSQL
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo -u postgres psql delivery_platform'

# Backup database
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo -u postgres pg_dump delivery_platform > backup.sql'

# Restore database
scp backup.sql ubuntu@52.66.71.133:/tmp/
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo -u postgres psql delivery_platform < /tmp/backup.sql'

# Redis CLI
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'redis-cli'
```

---

## 🔍 Troubleshooting

### Admin Panel Issues

**Admin panel not accessible:**
```bash
# Check nginx status
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo systemctl status nginx'

# Check nginx error logs
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo tail -100 /var/log/nginx/error.log'

# Restart nginx
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo systemctl restart nginx'
```

**502 Bad Gateway:**
```bash
# Check if backend service is running
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'pm2 list'

# Restart backend services
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'pm2 restart all'
```

### Backend Service Issues

**Service not starting:**
```bash
# Check logs
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'pm2 logs user-service --lines 100'

# Check if port is in use
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo netstat -tuln | grep 3001'

# Restart service
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'pm2 restart user-service'
```

**Database connection errors:**
```bash
# Check PostgreSQL status
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo systemctl status postgresql'

# Check connection
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo -u postgres psql -c "\l"'

# Restart PostgreSQL
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo systemctl restart postgresql'
```

### Monitoring Issues

**Grafana not accessible:**
```bash
# Check container status
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'cd /var/www/delivery-platform/monitoring && docker-compose ps'

# Restart monitoring stack
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'cd /var/www/delivery-platform/monitoring && docker-compose restart'

# Check logs
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'cd /var/www/delivery-platform/monitoring && docker-compose logs grafana'
```

### SSL Issues

**Certificate not working:**
```bash
# Check certificate
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo certbot certificates'

# Renew certificate
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo certbot renew'

# Test renewal
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 'sudo certbot renew --dry-run'
```

---

## 🔒 Security Checklist

After deployment:

- [ ] Change default admin password
- [ ] Update all environment variables in `/var/www/delivery-platform/.env`
- [ ] Configure external API keys (Stripe, Twilio, SendGrid, Google Maps, etc.)
- [ ] Enable firewall (UFW)
- [ ] Set up SSL certificate for HTTPS
- [ ] Disable SSH password authentication
- [ ] Set up automated backups
- [ ] Configure Grafana alerts
- [ ] Review and restrict monitoring port access
- [ ] Enable fail2ban for SSH protection
- [ ] Set up log rotation
- [ ] Configure security updates

---

## 📚 Additional Resources

- **Complete Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Detailed deployment documentation
- **Nginx Config:** [nginx-admin.conf](./nginx-admin.conf) - Web server configuration
- **PM2 Config:** [ecosystem.config.js](./ecosystem.config.js) - Process management
- **Environment:** `.env.production.example` - Environment variables template

---

## 💡 Deployment Workflow

### Initial Deployment

1. **Prepare:**
   ```bash
   # Save SSH key
   nano ~/.ssh/deploy_key
   chmod 600 ~/.ssh/deploy_key
   ```

2. **Deploy:**
   ```bash
   cd delivery-platform/deployment/production
   chmod +x *.sh
   ./deploy-complete.sh
   ```

3. **Configure Domain (Optional):**
   ```bash
   ./domain-setup.sh
   # Follow DNS instructions
   # Wait for propagation
   ```

4. **Enable HTTPS (Optional):**
   ```bash
   export DOMAIN="admin.yourdomain.com"
   ./ssl-setup.sh
   ```

5. **Verify:**
   ```bash
   ./test-deployment.sh
   ```

### Post-Deployment

1. **Change Passwords:**
   - Admin panel (admin@delivery-platform.com)
   - Grafana (admin)
   - Database (delivery_user)

2. **Configure API Keys:**
   ```bash
   ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133
   nano /var/www/delivery-platform/.env
   pm2 restart all
   ```

3. **Set Up Monitoring:**
   - Configure Grafana dashboards
   - Set up alert channels
   - Configure alert rules

4. **Set Up Backups:**
   ```bash
   # Create backup script
   ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133
   # Set up cron job for daily backups
   ```

### Ongoing Maintenance

- **Daily:** Check monitoring dashboards
- **Weekly:** Review logs for errors
- **Monthly:** Apply security updates
- **Quarterly:** Review and update SSL certificates (auto-renews)

---

## 🆘 Support

If you encounter issues:

1. Run the test script: `./test-deployment.sh`
2. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) troubleshooting section
3. Review logs (nginx, PM2, Docker)
4. Verify all services are running
5. Check server resources (CPU, memory, disk)

---

## 📊 Performance Tips

1. **Enable HTTP/2:** Already configured in nginx
2. **Use CDN:** For static assets (optional)
3. **Database Optimization:** Add indexes, use connection pooling
4. **Redis Caching:** Already configured for sessions and data
5. **PM2 Cluster Mode:** Already enabled for most services
6. **Monitoring:** Use Grafana to identify bottlenecks

---

**Version:** 2.0.0
**Platform:** Production Ready ✅
**Last Updated:** 2025-11-15
**Features:** Complete automation, monitoring, SSL, testing
