# Production Deployment Scripts

Quick deployment tools for the Delivery Platform Admin Panel.

## 🚀 Quick Start

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

### Deploy Admin Panel

Run the quick deployment script:

```bash
cd delivery-platform/deployment/production
chmod +x quick-deploy.sh
./quick-deploy.sh
```

This will:
- ✓ Build the admin panel
- ✓ Create deployment package
- ✓ Transfer files to server
- ✓ Configure nginx
- ✓ Deploy and start the application

**Access:** http://52.66.71.133

**Default Login:**
- Email: admin@delivery-platform.com
- Password: admin123

⚠️ **Change the default password immediately!**

## 📁 Files Overview

### Deployment Scripts

- **quick-deploy.sh** - One-command deployment (recommended)
- **deploy-admin-panel.sh** - Full automated deployment with verification
- **server-setup.sh** - Server environment setup

### Configuration Files

- **nginx-admin.conf** - Nginx web server configuration
- **.env.production** - Production environment variables
- **DEPLOYMENT_GUIDE.md** - Complete deployment documentation

## 🔧 Manual Deployment

If automated deployment doesn't work, follow the manual steps in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## 📝 Server Details

- **IP:** 52.66.71.133
- **User:** ubuntu
- **OS:** Ubuntu Linux
- **Web Server:** Nginx
- **App Location:** /var/www/delivery-platform/admin-panel

## 🔍 Troubleshooting

### Check if deployment is working:

```bash
# Test from local machine
curl http://52.66.71.133

# Check nginx status on server
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 "sudo systemctl status nginx"

# View nginx logs
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133 "sudo tail -f /var/log/nginx/error.log"
```

### Common Issues

**1. SSH Connection Failed**
```bash
# Verify key permissions
chmod 600 ~/.ssh/deploy_key

# Test connection
ssh -v -i ~/.ssh/deploy_key ubuntu@52.66.71.133
```

**2. Build Failed**
```bash
# Clear and rebuild
cd ../../frontend/admin-dashboard
rm -rf node_modules dist
npm install
npm run build
```

**3. Nginx Not Running**
```bash
ssh -i ~/.ssh/deploy_key ubuntu@52.66.71.133
sudo systemctl start nginx
sudo systemctl status nginx
```

**4. 502 Bad Gateway**
- Backend services not running
- Check nginx proxy configuration
- Verify port 3001 is accessible

## 🔄 Updating Deployment

To update after code changes:

```bash
cd delivery-platform/deployment/production
./quick-deploy.sh
```

## 🔒 Security Checklist

After deployment:

- [ ] Change default admin password
- [ ] Update API endpoints if needed
- [ ] Configure firewall rules
- [ ] Set up SSL certificate (optional)
- [ ] Enable auto-updates
- [ ] Set up monitoring

## 📚 Additional Resources

- **Full Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Nginx Config:** [nginx-admin.conf](./nginx-admin.conf)
- **Server Setup:** [server-setup.sh](./server-setup.sh)

## 💡 Next Steps

1. **Deploy Admin Panel** ✓
2. **Configure Backend Services** (if not running)
3. **Set up domain name** (optional)
4. **Enable HTTPS** (recommended)
5. **Set up monitoring**
6. **Configure backups**

## 🆘 Support

If you encounter issues:

1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) troubleshooting section
2. Review nginx error logs
3. Verify file permissions
4. Check server resources (disk, memory)

---

**Version:** 1.0.0
**Platform:** Production Ready ✅
**Last Updated:** 2025-11-15
