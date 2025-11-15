# Platform Setup Guide

## Complete Installation Instructions

### 1. System Requirements

- **Operating System:** Linux, macOS, or Windows (with WSL2)
- **RAM:** Minimum 16GB (32GB recommended for running all services)
- **CPU:** 4+ cores recommended
- **Disk:** 50GB+ available space
- **Network:** Stable internet connection

### 2. Install Prerequisites

#### Node.js & npm
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

#### Docker & Docker Compose
```bash
# Install Docker Desktop (includes Docker Compose)
# macOS: https://docs.docker.com/desktop/install/mac-install/
# Windows: https://docs.docker.com/desktop/install/windows-install/
# Linux: https://docs.docker.com/engine/install/

# Verify installation
docker --version
docker-compose --version
```

#### PostgreSQL Client (optional, for manual DB access)
```bash
# macOS
brew install postgresql@16

# Ubuntu/Debian
sudo apt-get install postgresql-client-16

# Windows
# Download from: https://www.postgresql.org/download/windows/
```

### 3. Clone and Setup Project

```bash
# Clone repository
git clone <repository-url>
cd delivery-platform

# Install root dependencies
npm install

# Install all workspace dependencies
npm run bootstrap
```

### 4. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

#### Required Environment Variables

**Database URLs:**
```env
DATABASE_URL=postgresql://delivery:delivery_dev_pass@localhost:5432/delivery_platform
MONGODB_URL=mongodb://delivery:delivery_dev_pass@localhost:27017/delivery_platform?authSource=admin
REDIS_URL=redis://:delivery_dev_pass@localhost:6379
KAFKA_BROKERS=localhost:9092
ELASTICSEARCH_URL=http://localhost:9200
```

**Security:**
```env
JWT_SECRET=<generate-random-string-at-least-32-chars>
```

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Payment Provider (Stripe):**
```env
STRIPE_SECRET_KEY=sk_test_...  # Get from https://dashboard.stripe.com/apikeys
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Google Maps:**
```env
GOOGLE_MAPS_API_KEY=...  # Get from https://console.cloud.google.com/
```

**Notifications:**
```env
# Firebase Cloud Messaging
FCM_SERVER_KEY=...  # Get from Firebase Console

# Twilio (SMS)
TWILIO_ACCOUNT_SID=...  # Get from https://console.twilio.com/
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# SendGrid (Email)
SENDGRID_API_KEY=...  # Get from https://sendgrid.com/
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### 5. Start Infrastructure Services

```bash
# Start databases and message brokers
docker-compose up -d postgres mongodb redis kafka zookeeper elasticsearch

# Wait for services to be healthy (check with)
docker-compose ps

# View logs if needed
docker-compose logs -f postgres
```

### 6. Initialize Database

```bash
# Run migrations
docker exec -i delivery-postgres psql -U delivery -d delivery_platform < database/migrations/001_initial_schema.sql

# Verify tables were created
docker exec -it delivery-postgres psql -U delivery -d delivery_platform -c "\dt"

# (Optional) Seed sample data
npm run db:seed
```

### 7. Start Backend Services

#### Option A: Using Docker Compose (Recommended)
```bash
# Start all services
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f api-gateway user-service order-service
```

#### Option B: Local Development
```bash
# Terminal 1: API Gateway
cd backend/api-gateway
npm install
npm run dev

# Terminal 2: User Service
cd backend/services/user-service
npm install
npm run dev

# Terminal 3: Order Service
cd backend/services/order-service
npm install
npm run dev

# Repeat for other services...
```

### 8. Start Admin Panel

```bash
cd web/admin-panel
npm install
npm run dev

# Access at http://localhost:3100
```

### 9. Verify Installation

#### Health Check
```bash
# API Gateway
curl http://localhost:3000/health

# Individual Services
curl http://localhost:3001/health  # User Service
curl http://localhost:3002/health  # Order Service
curl http://localhost:3003/health  # Vendor Service
# ... etc
```

#### Create Test User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "phone": "+1234567890",
    "firstName": "Test",
    "lastName": "User",
    "role": "customer"
  }'
```

### 10. Mobile App Setup (React Native)

#### Prerequisites
```bash
# Install React Native CLI
npm install -g react-native-cli

# iOS (macOS only)
sudo gem install cocoapods

# Android
# Install Android Studio and set up ANDROID_HOME
```

#### Customer App
```bash
cd mobile/customer-app
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

#### Configure API Endpoint
Edit `mobile/customer-app/src/config/api.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:3000/api/v1';
```

For physical device testing:
```typescript
export const API_BASE_URL = 'http://<your-local-ip>:3000/api/v1';
```

### 11. Troubleshooting

#### Port Conflicts
```bash
# Check what's using a port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres

# View logs
docker-compose logs postgres
```

#### Service Won't Start
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild service
docker-compose up --build <service-name>

# Reset everything (⚠️ destroys data)
docker-compose down -v
docker-compose up -d
```

#### Kafka Issues
```bash
# Kafka requires more memory
# Edit docker-compose.yml and add:
environment:
  KAFKA_HEAP_OPTS: "-Xmx512M -Xms512M"

# Restart Kafka
docker-compose restart kafka
```

### 12. Development Workflow

#### Making Code Changes
```bash
# Services auto-reload when using docker-compose
# Just edit files and save

# If changes don't reflect:
docker-compose restart <service-name>
```

#### Running Tests
```bash
# All tests
npm run test

# Specific service
cd backend/services/user-service
npm run test

# Watch mode
npm run test:watch
```

#### Database Migrations
```bash
# Create new migration
cat > database/migrations/002_my_migration.sql << 'EOF'
-- Your SQL here
ALTER TABLE users ADD COLUMN new_field VARCHAR(255);
EOF

# Run migration
docker exec -i delivery-postgres psql -U delivery -d delivery_platform < database/migrations/002_my_migration.sql
```

### 13. Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

### 14. Monitoring Setup

#### Prometheus
```bash
docker-compose -f docker-compose.monitoring.yml up -d

# Access at http://localhost:9090
```

#### Grafana
```bash
# Access at http://localhost:3002
# Default credentials: admin/admin
```

### 15. Common Commands Reference

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Restart a service
docker-compose restart <service-name>

# Rebuild and restart
docker-compose up --build <service-name>

# Clean up (⚠️ removes data)
docker-compose down -v

# Database backup
docker exec delivery-postgres pg_dump -U delivery delivery_platform > backup.sql

# Database restore
docker exec -i delivery-postgres psql -U delivery delivery_platform < backup.sql

# Enter PostgreSQL shell
docker exec -it delivery-postgres psql -U delivery -d delivery_platform

# Enter MongoDB shell
docker exec -it delivery-mongodb mongosh -u delivery -p delivery_dev_pass

# Enter Redis CLI
docker exec -it delivery-redis redis-cli -a delivery_dev_pass

# View Kafka topics
docker exec delivery-kafka kafka-topics --list --bootstrap-server localhost:9092
```

### 16. IDE Setup

#### VS Code (Recommended)
Install extensions:
- ESLint
- Prettier
- Docker
- GitLens
- TypeScript and JavaScript Language Features
- React Native Tools

Workspace settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### 17. Next Steps

1. ✅ Complete setup
2. 📖 Read [API Documentation](http://localhost:3000/api-docs)
3. 🎨 Review [Design System](/delivery-platform-design/)
4. 🏗️ Start building features
5. 🧪 Write tests
6. 🚀 Deploy to staging

### 18. Getting Help

- 📚 Check documentation in `/docs`
- 🐛 Report issues on GitHub
- 💬 Join our Discord/Slack community
- 📧 Email: dev@yourplatform.com

---

**You're all set! Start building the future of delivery** 🚀
