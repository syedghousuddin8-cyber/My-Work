# GitHub Actions CI/CD Setup

Automated deployment for the Delivery Platform using GitHub Actions.

## 🚀 Quick Start

### Step 1: Add SSH Private Key to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `SSH_PRIVATE_KEY`
5. Value: Paste the entire SSH private key (including BEGIN/END lines):

```
-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAvmrpF2HBGugmfD4Zr8aBdT5PvPbi5IWV+8G9u06xyH2V+oQe
KDF027295mQJnttvIFhS2Jvzg9AO/EmpwO/TDpdzjVWHgwDmiZhGGNkm4eoeaqkM
Mi1Y3IPgqYVOjs5wSswkYD5mTtBKWl6vx+Q5ncvlK2o0HQMHgiVVwcm92nWw1AJ/
rUj+AmjNUBXERF6Me9elUwRdDnSqgV7qVivx1+U/yInKvbNYtqH2OnVG9/ex18OG
2Bog+BrQQJS7Y5o+EZjU2aH6m6yrwQ45UZidaGgHTf7EnCWsDVhQcMrSPLR2qNZF
siSv8JSrlC39gl5GtJrwzkUZTQFT9m8Xp0rZEQIDAQABAoIBAQClxTETN/kC0aPf
ebim++tsBEkquswgIePGfo4MaKABaMOOikIuv496VZ7i2ag+cc42nG3TQUEoOZMy
M3bjDmXxSAxCuHj2pWwN0VEFBNcCyeyc8no5nJzFrNGDAxi23iWIGFx6pRgv+Mki
D1h8bsVyCDWELDseHqsEtDgKMvVjHpz7cSuccoPYhSl992rSLUvydfnXKWDJ3KEw
UYbsh6B0t1DrQSP6iMVnYF4EidxAIpvwKiRtI69bMbCj2llw+8zGbP0LP4Snaxif
FUGx8KzsVKzG9jwKIu0r9sZnaXqfpSGlUJ9umAe0cULeKsu5zUNTIC3KIpzqiVmX
TsqMOL8ZAoGBAOw43cG3f1AWT7w9G+rqgBoZEU4c+JF8weG1UX70iBKJ9PAjmYHn
JuSfM5VCpe23zb4yJ5PsHUE9WdH3iCBsA6BzBXCPSm0Ut6clK3j2dWRlYNMKYMpi
oj9Vt5JqMtjr0+jEwEK+MzguVmBr1Np9JRkNSpuvZzPJbpUUUIu2mwSrAoGBAM5c
R8Dw8PmanCGZXadgfb4wnqN3eD7jSsxmfa/hHNiCdtv3q1K4SPzRatrP8r0F6Prg
XsnsTScYbaTaXCvtKfywQWh4oIwkF5gvT3ekxrTSKrDw32k4yodGtXhw3R44g5QL
ixLLonf/uoFTs++NVfrL4og1OBbLM78tLP7PrMEzAoGBAKIl3sKsbK3SwuTZpaI5
WbmQX3qZFF75njSKu+hDfmwLWqDELwkmXGIujb/1QeTNeGMIFnbJasNvk4o3Oa/X
tR2cFq3PDi2WPQJ010RvGOHTXQVAaHREBE8pTZspXsHcD1gGRlsKKCp2VEBXhIJ9
yMtLfl0jp9m6eTfH/AoLTJmFAoGBAK+DFRQo2QuyUDDTfDArhUcJmyN1LTRvpOKM
GUJJuHr9G5Ki53gHfSxqAPPyAYZ7TFh0FKqw7D3gLQEVJ2fE4v0j+72bOxF2cQri
0jf0UXzhc6XieGHKB5desGGrvKVDc8Wqu7JUt+5P9pSgWF3aW9JfLmCiwv2//lcP
WUGv6EK5AoGAU1GLiPnUqKaDhI1Pktemzd21mpixOBPmxAb7dwN198EF4niLbgNi
T0C7dDTu13O0I+e2LdT7QgPdzBLHD1mtFESttLmgeMEvRBdSQ/gPg5CJExnA1teN
wp7D3j8A8eUwoSCjjf3peojk7qqYpt6ONyBiicD82KMnl9rge8xd0qM=
-----END RSA PRIVATE KEY-----
```

6. Click **Add secret**

### Step 2: Deploy!

#### Option 1: Automatic Deployment (Recommended)

Simply push your code to the repository:

```bash
git add .
git commit -m "Deploy admin panel"
git push
```

GitHub Actions will automatically:
- Build the admin panel when you change frontend code
- Deploy backend services when you change backend code

#### Option 2: Manual Deployment

1. Go to **Actions** tab in your GitHub repository
2. Click **Deploy Complete Platform** workflow
3. Click **Run workflow** button
4. Select what to deploy:
   - ✅ Deploy Admin Panel
   - ✅ Deploy Backend Services
   - ☐ Deploy Monitoring Stack
   - ✅ Setup Server Infrastructure (first time only)
5. Click **Run workflow**

Watch the deployment progress in real-time!

---

## 📋 Available Workflows

### 1. Deploy Admin Panel
**File:** `deploy-admin.yml`
**Trigger:** Automatic on push to admin dashboard files
**Manual:** Yes

Deploys the React admin panel to nginx.

**What it does:**
- Builds React app with Vite
- Creates optimized production bundle
- Transfers to server
- Configures nginx
- Verifies deployment

**Time:** ~3-5 minutes

---

### 2. Deploy Backend Services
**File:** `deploy-backend.yml`
**Trigger:** Automatic on push to backend services
**Manual:** Yes

Deploys all 11 microservices with PM2.

**What it does:**
- Packages backend services
- Transfers to server
- Installs dependencies
- Builds TypeScript services
- Starts/restarts with PM2

**Time:** ~5-10 minutes

---

### 3. Deploy Complete Platform
**File:** `deploy-all.yml`
**Trigger:** Manual only
**Manual:** Yes (with options)

Deploys everything - infrastructure, admin, backend, monitoring.

**Options:**
- Setup Infrastructure (Node.js, PostgreSQL, Redis, Docker)
- Deploy Admin Panel
- Deploy Backend Services
- Deploy Monitoring Stack

**Time:** ~15-20 minutes (full stack)

---

## 🎯 Deployment Scenarios

### First-Time Deployment

1. **Add SSH key to GitHub Secrets** (see Step 1 above)

2. **Run complete deployment:**
   - Go to Actions → Deploy Complete Platform
   - Enable ALL options:
     - ✅ Setup Server Infrastructure
     - ✅ Deploy Admin Panel
     - ✅ Deploy Backend Services
     - ✅ Deploy Monitoring Stack
   - Click Run workflow

3. **Wait 15-20 minutes**

4. **Access your platform:**
   - Admin Panel: http://52.66.71.133
   - Login: admin@delivery-platform.com / admin123
   - Grafana: http://52.66.71.133:3000

---

### Update Admin Panel Only

**Option 1: Automatic**
```bash
# Make changes to admin dashboard
cd delivery-platform/frontend/admin-dashboard
# ... make your changes ...
git add .
git commit -m "Update admin panel UI"
git push
```

GitHub Actions automatically deploys when you push.

**Option 2: Manual**
- Actions → Deploy Admin Panel → Run workflow

---

### Update Backend Services

**Option 1: Automatic**
```bash
# Make changes to backend
cd delivery-platform/backend/services/user-service
# ... make your changes ...
git add .
git commit -m "Update user service"
git push
```

**Option 2: Manual**
- Actions → Deploy Backend Services → Run workflow

---

### Deploy Everything

Best for major updates or initial deployment:

- Actions → Deploy Complete Platform → Run workflow
- Select all components you want to deploy

---

## 📊 Monitoring Deployments

### View Deployment Progress

1. Go to **Actions** tab
2. Click on the running workflow
3. Watch real-time logs

### Check Deployment Status

Each workflow shows:
- ✅ Build success/failure
- ✅ Deployment success/failure
- ✅ Verification results
- ⏱️ Deployment time

### Notifications

GitHub will:
- Show status badges
- Send email on failure (if configured)
- Update commit status

---

## 🔧 Configuration

### Environment Variables

Admin panel environment variables are set in the workflow:

```yaml
env:
  VITE_API_URL: http://52.66.71.133/api/v1
  VITE_WS_URL: ws://52.66.71.133/ws
  VITE_ENV: production
```

To change them:
1. Edit `.github/workflows/deploy-admin.yml`
2. Update the `env:` section
3. Commit and push

### Server Configuration

The workflows deploy to:
- **Server IP:** 52.66.71.133
- **User:** ubuntu
- **SSH Key:** From GitHub Secrets

To change server:
1. Edit workflow files
2. Replace `52.66.71.133` with your server IP
3. Update SSH key in GitHub Secrets

---

## 🔍 Troubleshooting

### Deployment Failed

1. **Check workflow logs:**
   - Go to Actions tab
   - Click failed workflow
   - Read error messages

2. **Common issues:**

**SSH Connection Failed:**
- Verify SSH key in GitHub Secrets is correct
- Ensure server is accessible from GitHub (no firewall blocking)

**Build Failed:**
- Check package.json dependencies
- Review build logs for errors
- Ensure Node.js version compatibility

**Deployment Failed:**
- Check server disk space
- Verify permissions on server
- Check nginx/PM2 logs on server

### Verification Failed

If deployment succeeds but verification fails:

```bash
# SSH to server and check manually
ssh ubuntu@52.66.71.133

# Check nginx
sudo systemctl status nginx
sudo nginx -t

# Check admin panel files
ls -la /var/www/delivery-platform/admin-panel

# Check PM2 services
pm2 list
pm2 logs
```

### Rollback Deployment

Each deployment creates a backup:

```bash
# SSH to server
ssh ubuntu@52.66.71.133

# List backups
ls -la /var/www/delivery-platform/

# Restore previous version
sudo mv /var/www/delivery-platform/admin-panel /var/www/delivery-platform/admin-panel.current
sudo mv /var/www/delivery-platform/admin-panel.backup.20251115-120000 /var/www/delivery-platform/admin-panel
sudo systemctl reload nginx
```

---

## 🔒 Security

### GitHub Secrets

Never commit:
- SSH private keys
- API keys
- Passwords
- Database credentials

Always use GitHub Secrets for sensitive data.

### SSH Key Security

The SSH key in GitHub Secrets:
- Is encrypted by GitHub
- Only accessible to workflow runs
- Never exposed in logs
- Deleted after workflow completes

### Server Security

The workflows:
- Use SSH key authentication (no passwords)
- Don't expose sensitive data in logs
- Clean up temporary files after deployment

---

## 📈 Advanced Usage

### Custom Deployment Branch

To deploy from a different branch:

Edit workflow file and change:
```yaml
on:
  push:
    branches:
      - main
      - your-branch-name  # Add your branch
```

### Deploy to Multiple Servers

1. Add more SSH keys to secrets:
   - `SSH_PRIVATE_KEY_STAGING`
   - `SSH_PRIVATE_KEY_PRODUCTION`

2. Duplicate workflow file
3. Change server IP and secret name

### Automated Testing Before Deploy

Add test step before deployment:

```yaml
- name: Run tests
  run: |
    cd delivery-platform/frontend/admin-dashboard
    npm run test
```

### Slack Notifications

Add Slack notification on deployment:

1. Add `SLACK_WEBHOOK` to secrets
2. Add step to workflow:

```yaml
- name: Notify Slack
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -H 'Content-Type: application/json' \
      -d '{"text":"Deployment successful!"}'
```

---

## 📚 Workflow Details

### Deploy Admin Panel Workflow

```
1. Checkout code from GitHub
2. Setup Node.js 20
3. Install dependencies (npm ci)
4. Build production bundle
5. Setup SSH connection
6. Transfer files to server
7. Extract and deploy
8. Configure nginx
9. Verify deployment
```

### Deploy Backend Workflow

```
1. Checkout code
2. Package backend services
3. Setup SSH
4. Transfer to server
5. Install dependencies
6. Build TypeScript
7. Start/restart with PM2
8. Verify services
```

### Complete Deployment Workflow

```
1. Setup Infrastructure (if selected)
   - Install Node.js, PostgreSQL, Redis, Docker
   - Configure databases
2. Deploy Admin Panel (if selected)
3. Deploy Backend Services (if selected)
4. Deploy Monitoring (if selected)
5. Verify all components
```

---

## 💡 Tips & Best Practices

1. **Use automatic deployment for development:**
   - Push small changes frequently
   - GitHub Actions deploys automatically

2. **Use manual deployment for production:**
   - More control over what gets deployed
   - Review changes before deploying

3. **Always verify after deployment:**
   - Check the verification step in workflow
   - Test the live site manually

4. **Monitor deployment frequency:**
   - Too frequent = wasted resources
   - Use path filters to deploy only when needed

5. **Keep workflows simple:**
   - One workflow = one task
   - Easy to debug and maintain

---

## 🎉 Benefits of GitHub Actions

✅ **Automated Deployment** - Push code, automatic deployment
✅ **No Local Setup** - Deploy from anywhere, any device
✅ **Version Control** - All deployments tracked in git
✅ **Rollback Easy** - Revert commits to rollback
✅ **Team Collaboration** - Everyone can deploy
✅ **Free for Public Repos** - 2000 minutes/month for private
✅ **Reliable** - GitHub infrastructure
✅ **Scalable** - Deploy to multiple servers

---

## 📞 Support

If you encounter issues:

1. Check workflow logs in Actions tab
2. Review this documentation
3. Check server logs: `ssh ubuntu@52.66.71.133 'pm2 logs'`
4. Verify GitHub Secrets are configured correctly

---

**Version:** 1.0.0
**Last Updated:** 2025-11-15
**Status:** Production Ready ✅
