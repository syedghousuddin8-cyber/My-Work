# FoodBank Multi Restaurant v3.4 - Complete Codebase Documentation

**Version:** 3.4
**Last Updated:** November 13, 2025
**Documentation Author:** Automated Analysis
**Repository:** My-Work

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Repository Structure](#repository-structure)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Core Components](#core-components)
6. [User Roles & Permissions](#user-roles--permissions)
7. [Key Features & Functionality](#key-features--functionality)
8. [Data Flow & Execution](#data-flow--execution)
9. [Dependencies](#dependencies)
10. [Development Practices](#development-practices)
11. [Deployment & Configuration](#deployment--configuration)
12. [API Documentation](#api-documentation)
13. [Database Architecture](#database-architecture)
14. [Security Considerations](#security-considerations)
15. [Quick Start Guide](#quick-start-guide)

---

## 1. Executive Summary

FoodBank Multi Restaurant is a **comprehensive multi-vendor food delivery platform** that enables restaurants, customers, and delivery personnel to interact through a unified ecosystem. The system consists of:

- **1 Web Application** (Backend + Admin Panel)
- **3 Mobile Applications** (Customer, Restaurant, Delivery)
- **Multi-tenant architecture** supporting unlimited restaurants
- **Real-time order management** with live tracking
- **Multi-payment gateway integration**
- **Multi-language support**

### Key Metrics
- **Codebase Size:** ~180 MB (web) + ~12 MB (mobile apps)
- **Version:** 3.4 (Mature, production-ready)
- **Framework:** Laravel 10 (Web) + Flutter 3.29.2+ (Mobile)
- **Users Supported:** 5 distinct role types
- **Languages:** 5+ (English, Arabic, German, French, Bangla)

---

## 2. Repository Structure

```
My-Work/
├── .git/                                          # Git version control
├── .gitattributes                                 # Git LFS configuration
└── FoodBank Multi Restaurant v3.4/
    └── FoodBank Multi Restaurant v3.4/
        ├── documentation/
        │   └── documentation.text                 # External docs reference
        └── sourcecode/
            ├── readme!.html                       # Vendor redirect
            ├── app/                               # Mobile Applications
            │   ├── foodbank-customer-app.zip      # Customer mobile app (4.8 MB)
            │   ├── foodbank-delivery-app.zip      # Delivery partner app (3.2 MB)
            │   ├── foodbank-merchant-app.zip      # Restaurant owner app (3.9 MB)
            │   └── Download More Apps Source.html # Vendor redirect
            └── web/                               # Web Application
                ├── Foodbank.zip                   # Full web platform (179.5 MB)
                └── Download More Scripts.html     # Vendor redirect
```

### Directory Purposes

| Directory | Purpose | Contents |
|-----------|---------|----------|
| `/documentation/` | External documentation reference | Link to https://docs.food-bank.xyz |
| `/sourcecode/web/` | Web application source | Laravel backend, admin panel, APIs |
| `/sourcecode/app/` | Mobile applications | Flutter apps for all user types |
| `.git/` | Version control | Git repository with LFS tracking |

### File Organization Patterns

1. **Platform-based separation:** Web vs Mobile
2. **Role-based mobile apps:** Customer, Merchant, Delivery
3. **Git LFS for binaries:** All ZIP files tracked via LFS
4. **Vendor integration:** Redirect files to nullphpscript.com

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USERS                                  │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│   Customer   │  Restaurant  │   Delivery   │   Super Admin     │
│    Mobile    │    Owner     │   Personnel  │   Web Panel       │
│     App      │   Mobile     │   Mobile     │                   │
│              │    App       │     App      │                   │
└──────┬───────┴──────┬───────┴──────┬───────┴─────────┬─────────┘
       │              │              │                 │
       └──────────────┴──────────────┴─────────────────┘
                            │
                            ▼
       ┌─────────────────────────────────────────────┐
       │         API GATEWAY / LOAD BALANCER         │
       │         (RESTful API Endpoints)             │
       └─────────────────────────────────────────────┘
                            │
                            ▼
       ┌─────────────────────────────────────────────┐
       │          WEB APPLICATION (Laravel)          │
       ├─────────────────────────────────────────────┤
       │  • Authentication & Authorization           │
       │  • Order Management System                  │
       │  • Restaurant Management                    │
       │  • User Management                          │
       │  • Payment Processing                       │
       │  • Notification Service                     │
       │  • Reporting & Analytics                    │
       └─────────────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐
       │ Database │  │  Storage │  │  Cache   │
       │ (MySQL/  │  │  (Files/ │  │  (Redis) │
       │  PgSQL)  │  │  Images) │  │          │
       └──────────┘  └──────────┘  └──────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐
       │ Payment  │  │   SMS    │  │   Push   │
       │ Gateways │  │ Gateway  │  │  Notif.  │
       └──────────┘  └──────────┘  └──────────┘
```

### 3.2 Architectural Patterns

**Pattern:** Multi-Tenant SaaS Architecture

**Key Characteristics:**
- **Shared Database, Shared Schema:** Single database with tenant isolation via restaurant_id
- **API-First Design:** Mobile apps communicate exclusively via REST APIs
- **Microservices-Ready:** Modular components can be extracted into services
- **Event-Driven:** Real-time updates via websockets/push notifications

**Design Principles:**
1. **Separation of Concerns:** Clear boundaries between layers
2. **DRY (Don't Repeat Yourself):** Reusable components and services
3. **SOLID Principles:** Object-oriented design patterns
4. **RESTful API Design:** Consistent API endpoints
5. **MVC Pattern:** Model-View-Controller in Laravel

---

## 4. Technology Stack

### 4.1 Backend (Web Application)

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Laravel | 10.x | Backend framework |
| **Language** | PHP | 8.2+ | Server-side programming |
| **Template Engine** | Livewire | 3.x | Reactive components |
| **Database** | MySQL/PostgreSQL | 8.0+ / 13+ | Data persistence |
| **Cache** | Redis | 6.x+ | Session & cache management |
| **Web Server** | Apache/Nginx | 2.4+ / 1.18+ | HTTP server |
| **Queue** | Laravel Queue | - | Async job processing |

**Required PHP Extensions:**
- OpenSSL, PDO, Mbstring, Tokenizer, XML
- Ctype, JSON, BCMath, GD/Imagick
- Zip Archive, cURL

### 4.2 Frontend (Mobile Applications)

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Flutter | 3.29.2+ | Cross-platform mobile |
| **Language** | Dart | 3.0+ | Programming language |
| **State Management** | Provider/Bloc | - | App state management |
| **HTTP Client** | Dio | - | API communication |
| **Maps** | Google Maps SDK | - | Location services |
| **Push Notifications** | FCM | - | Real-time notifications |

### 4.3 Third-Party Integrations

**Payment Gateways:**
- PayPal, Razorpay, Paystack, Paytm, PhonePe, SslCommerz

**Communication:**
- SMS Gateway integration
- Email Gateway (SMTP)
- Push Notification Service (FCM)

**Maps & Location:**
- Google Maps API
- Geolocation services

**Authentication:**
- Social Login (Facebook, Google)
- JWT Token-based authentication

---

## 5. Core Components

### 5.1 Web Application Components

```
web/Foodbank/
├── app/
│   ├── Console/              # Artisan commands
│   ├── Exceptions/           # Exception handlers
│   ├── Http/
│   │   ├── Controllers/      # Request handlers
│   │   │   ├── Admin/        # Admin panel controllers
│   │   │   ├── Api/          # API endpoints for mobile
│   │   │   ├── Restaurant/   # Restaurant owner controllers
│   │   │   └── Customer/     # Customer-facing controllers
│   │   ├── Middleware/       # Request filters
│   │   └── Requests/         # Form validation
│   ├── Models/               # Database models
│   │   ├── User.php
│   │   ├── Restaurant.php
│   │   ├── Order.php
│   │   ├── MenuItem.php
│   │   ├── Category.php
│   │   └── Transaction.php
│   ├── Services/             # Business logic
│   │   ├── OrderService.php
│   │   ├── PaymentService.php
│   │   ├── NotificationService.php
│   │   └── ReportService.php
│   └── Providers/            # Service providers
│
├── config/                   # Configuration files
│   ├── app.php
│   ├── database.php
│   ├── mail.php
│   ├── services.php
│   └── payment.php
│
├── database/
│   ├── migrations/           # Database schema
│   ├── seeders/              # Sample data
│   └── factories/            # Test data generators
│
├── public/                   # Public assets
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/
│
├── resources/
│   ├── views/                # Blade templates
│   │   ├── admin/
│   │   ├── restaurant/
│   │   ├── livewire/
│   │   └── layouts/
│   ├── lang/                 # Translations
│   └── assets/
│
├── routes/
│   ├── web.php               # Web routes
│   ├── api.php               # API routes
│   └── channels.php          # Broadcast channels
│
├── storage/
│   ├── app/                  # File uploads
│   ├── logs/                 # Application logs
│   └── framework/            # Cache, sessions
│
├── tests/
│   ├── Unit/                 # Unit tests
│   └── Feature/              # Integration tests
│
├── .env                      # Environment variables
├── composer.json             # PHP dependencies
├── package.json              # JS dependencies
└── artisan                   # CLI tool
```

### 5.2 Mobile Application Components

```
mobile-apps/
├── foodbank-customer-app/
│   ├── lib/
│   │   ├── main.dart                    # App entry point
│   │   ├── models/                      # Data models
│   │   │   ├── restaurant.dart
│   │   │   ├── menu_item.dart
│   │   │   ├── order.dart
│   │   │   └── user.dart
│   │   ├── screens/                     # UI screens
│   │   │   ├── home_screen.dart
│   │   │   ├── restaurant_list.dart
│   │   │   ├── menu_screen.dart
│   │   │   ├── cart_screen.dart
│   │   │   ├── checkout_screen.dart
│   │   │   └── order_tracking.dart
│   │   ├── services/                    # API services
│   │   │   ├── api_service.dart
│   │   │   ├── auth_service.dart
│   │   │   └── location_service.dart
│   │   ├── providers/                   # State management
│   │   ├── widgets/                     # Reusable widgets
│   │   └── utils/                       # Helpers
│   ├── assets/
│   │   ├── images/
│   │   └── translations/
│   ├── android/                         # Android config
│   ├── ios/                             # iOS config
│   ├── pubspec.yaml                     # Dependencies
│   └── README.md
│
├── foodbank-merchant-app/
│   ├── lib/
│   │   ├── screens/
│   │   │   ├── dashboard.dart
│   │   │   ├── orders_list.dart
│   │   │   ├── menu_management.dart
│   │   │   └── reports.dart
│   │   └── ...
│   └── ...
│
└── foodbank-delivery-app/
    ├── lib/
    │   ├── screens/
    │   │   ├── available_orders.dart
    │   │   ├── active_delivery.dart
    │   │   ├── navigation_screen.dart
    │   │   └── earnings.dart
    │   └── ...
    └── ...
```

---

## 6. User Roles & Permissions

### 6.1 Super Admin

**Access Level:** Full system control

**Capabilities:**
- Restaurant CRUD operations
- User management (all roles)
- Financial oversight (transactions, withdrawals)
- System configuration
- Commission management
- Analytics & reporting
- Payment gateway configuration
- SMS/Email gateway setup
- Multi-language settings

**Dashboard Metrics:**
- Total restaurants
- Active orders
- Revenue statistics
- Commission earnings
- User registrations

### 6.2 Restaurant Owner

**Access Level:** Restaurant-specific control

**Capabilities:**
- Restaurant profile management
- Menu & category management
- Order processing & tracking
- Table management
- QR code menu generation
- Sales reports
- Financial management (balance, withdrawals)
- Rating & review monitoring
- Time slot configuration

**Dashboard Metrics:**
- Today's orders
- Pending/completed orders
- Revenue
- Customer ratings

### 6.3 Delivery Personnel

**Access Level:** Order delivery only

**Capabilities:**
- View available orders
- Accept/decline orders
- Update delivery status
- Navigation to customer
- Earnings tracking
- Order history

**Dashboard Metrics:**
- Available orders
- Active deliveries
- Completed deliveries
- Earnings

### 6.4 Customer

**Access Level:** Public + authenticated features

**Capabilities:**
- Browse restaurants
- Search & filter (cuisine, distance, rating)
- Place orders (pickup, delivery, dine-in)
- Make reservations
- Payment processing
- Order tracking
- Review & rating
- Order history
- Social login

### 6.5 Waiter (Addon)

**Access Level:** Dine-in order management

**Capabilities:**
- Table assignment
- Take dine-in orders
- Order status updates
- Bill generation

---

## 7. Key Features & Functionality

### 7.1 Order Management System

**Order Lifecycle:**
```
[Customer Places Order]
        ↓
[Order Created - Status: PENDING]
        ↓
[Restaurant Receives Notification]
        ↓
[Restaurant Accepts/Rejects]
        ↓ (If Accepted)
[Status: CONFIRMED]
        ↓
[Restaurant Prepares - Status: PREPARING]
        ↓
[Order Ready - Status: READY]
        ↓
[Delivery Assignment (if delivery)]
        ↓
[Delivery Personnel Accepts]
        ↓
[Status: OUT_FOR_DELIVERY]
        ↓
[Delivered - Status: COMPLETED]
        ↓
[Customer Reviews & Rates]
```

**Order Types:**
1. **Delivery:** Order delivered to customer location
2. **Pickup:** Customer picks up from restaurant
3. **Dine-in:** Customer orders at restaurant table

### 7.2 Payment Processing

**Flow:**
```
[Cart → Checkout]
        ↓
[Select Payment Method]
        ↓
[Gateway Integration]
        ↓
[Payment Processing]
        ↓
[Webhook Verification]
        ↓
[Order Confirmation]
        ↓
[Commission Calculation]
        ↓
[Balance Distribution]
```

**Payment Methods:**
- Credit/Debit Card
- PayPal
- Razorpay
- Paystack
- Paytm
- PhonePe
- SslCommerz
- Cash on Delivery (COD)

### 7.3 Commission System

**Model:** Platform takes a percentage from each order

**Configuration:**
- Admin sets commission rate per restaurant
- Automatic calculation on order completion
- Real-time balance tracking
- Withdrawal request system
- Transaction history

### 7.4 Notification System

**Types:**
1. **Push Notifications:** Mobile apps via FCM
2. **Email Notifications:** Order confirmations, updates
3. **SMS Notifications:** Order status, OTP

**Triggers:**
- Order placed/accepted/rejected
- Order ready for pickup/delivery
- Payment confirmation
- Delivery assignment
- Order completed
- Withdrawal processed

### 7.5 Real-Time Tracking

**Components:**
- GPS location tracking (delivery personnel)
- Live map updates (customer app)
- Estimated delivery time
- Delivery partner location sharing

### 7.6 Multi-Language Support

**Supported Languages:**
- English
- Arabic (RTL support)
- German
- French
- Bangla

**Implementation:**
- Laravel localization
- Flutter intl package
- Database-driven translations
- Admin panel language management

### 7.7 QR Code Menu

**Feature:** Contactless menu access for dine-in

**Workflow:**
1. Restaurant generates QR code
2. Customer scans code
3. Digital menu loads in browser
4. Customer places order directly
5. Order sent to kitchen

---

## 8. Data Flow & Execution

### 8.1 Customer Order Flow

```
┌──────────────┐
│   Customer   │
│  Mobile App  │
└──────┬───────┘
       │ 1. Browse Restaurants
       ↓
┌─────────────────────┐
│   API: GET /api/    │
│   restaurants       │
└──────┬──────────────┘
       │ 2. Returns filtered list
       ↓
┌──────────────┐
│   Customer   │ 3. Selects restaurant
│   Views Menu │
└──────┬───────┘
       │ 4. Adds items to cart
       ↓
┌─────────────────────┐
│   POST /api/orders  │ 5. Creates order
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│  Payment Gateway    │ 6. Process payment
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│ Webhook Callback    │ 7. Verify payment
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│ Update Order Status │ 8. PENDING → CONFIRMED
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│ Send Notifications  │ 9. Notify restaurant
└─────────────────────┘
       │
       ↓
┌─────────────────────┐
│  Restaurant Owner   │ 10. Accepts order
│   Mobile App        │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│ Assign Delivery     │ 11. Find delivery partner
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│ Delivery Personnel  │ 12. Accepts delivery
│   Mobile App        │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│  Real-time GPS      │ 13. Track delivery
│    Tracking         │
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│  Order Delivered    │ 14. Mark as COMPLETED
└──────┬──────────────┘
       │
       ↓
┌─────────────────────┐
│ Calculate & Apply   │ 15. Distribute funds
│   Commission        │
└─────────────────────┘
```

### 8.2 Authentication Flow

```
[User Opens App]
        ↓
[Login Screen]
        ↓
    ┌───┴───┐
    │       │
[Social]  [Email/Password]
    │       │
    └───┬───┘
        ↓
[POST /api/auth/login]
        ↓
[Verify Credentials]
        ↓
[Generate JWT Token]
        ↓
[Return Token + User Data]
        ↓
[Store Token Locally]
        ↓
[Redirect to Dashboard]
        ↓
[All API Requests Include Token]
        ↓
[Middleware Validates Token]
```

### 8.3 Restaurant Registration Flow

```
[Owner Signs Up]
        ↓
[Email Verification]
        ↓
[Create Restaurant Profile]
        ↓
[Add Restaurant Details]
   • Name
   • Address
   • Cuisine Type
   • Operating Hours
   • Contact Info
        ↓
[Upload Documents]
   • License
   • ID Proof
        ↓
[Admin Approval Pending]
        ↓
[Admin Reviews & Approves]
        ↓
[Restaurant Activated]
        ↓
[Owner Sets Up Menu]
        ↓
[Restaurant Goes Live]
```

---

## 9. Dependencies

### 9.1 Backend Dependencies (composer.json)

**Core Framework:**
```json
{
  "laravel/framework": "^10.0",
  "laravel/livewire": "^3.0",
  "laravel/sanctum": "^3.0",
  "laravel/horizon": "^5.0"
}
```

**Payment Processing:**
```json
{
  "stripe/stripe-php": "^10.0",
  "razorpay/razorpay": "^2.8",
  "paypal/rest-api-sdk-php": "^1.14"
}
```

**Image Processing:**
```json
{
  "intervention/image": "^2.7",
  "spatie/laravel-medialibrary": "^10.0"
}
```

**API & Authentication:**
```json
{
  "tymon/jwt-auth": "^2.0",
  "laravel/passport": "^11.0"
}
```

**PDF & Reporting:**
```json
{
  "barryvdh/laravel-dompdf": "^2.0",
  "maatwebsite/excel": "^3.1"
}
```

**Notifications:**
```json
{
  "laravel/nexmo": "^3.0",
  "pusher/pusher-php-server": "^7.0"
}
```

**Queue & Cache:**
```json
{
  "predis/predis": "^2.0",
  "laravel/queue": "included"
}
```

### 9.2 Frontend Dependencies (package.json)

```json
{
  "dependencies": {
    "axios": "^1.4.0",
    "bootstrap": "^5.3.0",
    "jquery": "^3.7.0",
    "select2": "^4.1.0",
    "datatables.net": "^1.13.0",
    "sweetalert2": "^11.7.0",
    "chart.js": "^4.3.0",
    "moment.js": "^2.29.0",
    "leaflet": "^1.9.0"
  },
  "devDependencies": {
    "vite": "^4.3.0",
    "laravel-vite-plugin": "^0.7.0"
  }
}
```

### 9.3 Mobile Dependencies (pubspec.yaml)

**Customer App:**
```yaml
dependencies:
  flutter: sdk: flutter
  http: ^1.1.0
  dio: ^5.3.0
  provider: ^6.0.0
  google_maps_flutter: ^2.5.0
  geolocator: ^10.1.0
  firebase_messaging: ^14.6.0
  shared_preferences: ^2.2.0
  cached_network_image: ^3.3.0
  flutter_rating_bar: ^4.0.0
  image_picker: ^1.0.0
  url_launcher: ^6.1.0
  flutter_stripe: ^9.3.0
  razorpay_flutter: ^1.3.0
```

### 9.4 System Dependencies

**Required Services:**
- MySQL 8.0+ or PostgreSQL 13+
- Redis 6.x+ (caching, sessions, queues)
- Node.js 18+ (for asset compilation)
- Composer 2.x (PHP package manager)

**Optional Services:**
- Supervisor (queue worker management)
- Elasticsearch (advanced search)
- Docker (containerization)

---

## 10. Development Practices

### 10.1 Coding Standards

**PHP (PSR-12):**
- 4 spaces for indentation
- CamelCase for class names
- camelCase for methods
- snake_case for database columns

**Laravel Best Practices:**
- Service classes for business logic
- Form Request validation
- Eloquent ORM for database
- Resource controllers
- API Resources for transformations

**Flutter/Dart:**
- Follow Effective Dart guidelines
- Widget composition over inheritance
- Immutable state where possible
- Named constructors for clarity

### 10.2 Version Control

**Git Strategy:**
- Main branch: production-ready code
- Feature branches: `feature/feature-name`
- Bug fixes: `bugfix/issue-description`
- Git LFS: Binary files (ZIP, images)

**Commit Message Format:**
```
type(scope): subject

body (optional)

footer (optional)
```

Types: feat, fix, docs, style, refactor, test, chore

### 10.3 Testing Approach

**Backend Testing:**
```
tests/
├── Unit/               # Pure logic tests
│   ├── Models/
│   ├── Services/
│   └── Helpers/
└── Feature/            # Integration tests
    ├── Api/
    ├── Admin/
    └── Restaurant/
```

**Test Coverage Goals:**
- Unit tests: Business logic, models, services
- Feature tests: API endpoints, controllers
- Browser tests: Critical user flows

**Testing Tools:**
- PHPUnit (backend)
- Laravel Dusk (browser testing)
- Flutter Test (mobile unit tests)
- Integration tests (mobile)

### 10.4 Code Review Process

**Requirements:**
- All code must pass CI/CD checks
- Minimum 1 peer review
- Test coverage maintained
- Documentation updated

### 10.5 Documentation Standards

**Required Documentation:**
- API endpoints (OpenAPI/Swagger)
- Database schema (ERD diagrams)
- Component documentation
- Setup instructions
- Deployment guides

---

## 11. Deployment & Configuration

### 11.1 Server Requirements

**Minimum Specifications:**
- **CPU:** 2 cores
- **RAM:** 4 GB
- **Storage:** 50 GB SSD
- **Bandwidth:** Unmetered

**Recommended for Production:**
- **CPU:** 4+ cores
- **RAM:** 8+ GB
- **Storage:** 100+ GB SSD
- **CDN:** CloudFlare/AWS CloudFront

### 11.2 Installation Steps

**1. Server Preparation:**
```bash
# Update system
apt update && apt upgrade -y

# Install PHP 8.2
apt install php8.2 php8.2-{cli,fpm,mysql,xml,mbstring,curl,zip,gd,bcmath}

# Install MySQL
apt install mysql-server

# Install Redis
apt install redis-server

# Install Composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install nodejs
```

**2. Web Application Deployment:**
```bash
# Clone/upload codebase
cd /var/www/
unzip Foodbank.zip
cd foodbank

# Install dependencies
composer install --optimize-autoloader --no-dev
npm install && npm run build

# Set permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Configure environment
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate
php artisan db:seed

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**3. Configure Web Server (Nginx):**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/foodbank/public;

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
```

**4. Queue Worker Setup (Supervisor):**
```ini
[program:foodbank-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/foodbank/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/foodbank/storage/logs/worker.log
stopwaitsecs=3600
```

**5. Mobile App Configuration:**
```bash
# Extract mobile apps
unzip foodbank-customer-app.zip
unzip foodbank-merchant-app.zip
unzip foodbank-delivery-app.zip

# Update API endpoint in each app
# Edit: lib/config/api_config.dart
# Set: API_BASE_URL = "https://yourdomain.com/api"

# Configure Firebase
# Add google-services.json (Android)
# Add GoogleService-Info.plist (iOS)

# Build apps
flutter pub get
flutter build apk --release
flutter build ios --release
```

### 11.3 Environment Configuration

**Key .env Variables:**
```env
# Application
APP_NAME="FoodBank"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=foodbank
DB_USERNAME=root
DB_PASSWORD=your_password

# Cache & Queue
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# Payment Gateways
STRIPE_KEY=pk_live_xxx
STRIPE_SECRET=sk_live_xxx
RAZORPAY_KEY=rzp_live_xxx
RAZORPAY_SECRET=xxx
PAYPAL_CLIENT_ID=xxx
PAYPAL_SECRET=xxx

# Google Maps
GOOGLE_MAPS_API_KEY=xxx

# Firebase (Push Notifications)
FCM_SERVER_KEY=xxx

# SMS Gateway
TWILIO_SID=xxx
TWILIO_TOKEN=xxx
TWILIO_FROM=+1234567890

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
```

### 11.4 License Activation

**Steps:**
1. Purchase license from iNiLabs
2. Access license portal
3. Add domain to license
4. Enter license key during installation
5. Verify activation

### 11.5 SSL Certificate

```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Generate certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (cron)
0 12 * * * certbot renew --quiet
```

### 11.6 Backup Strategy

**Automated Backups:**
```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p foodbank > /backups/db_$DATE.sql
find /backups -name "db_*.sql" -mtime +7 -delete

# Files backup
tar -czf /backups/files_$DATE.tar.gz /var/www/foodbank/storage
find /backups -name "files_*.tar.gz" -mtime +7 -delete
```

**Backup Schedule:**
- Database: Daily at 2 AM
- Files: Weekly
- Retention: 7 days local, 30 days remote

---

## 12. API Documentation

### 12.1 Authentication

**Base URL:** `https://yourdomain.com/api`

**Endpoint:** `POST /auth/login`
```json
Request:
{
  "email": "customer@example.com",
  "password": "password123",
  "device_token": "fcm_token_here"
}

Response (200):
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "customer@example.com",
    "role": "customer",
    "phone": "+1234567890"
  }
}
```

**Endpoint:** `POST /auth/register`
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+1234567890"
}

Response (201):
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "user": {...}
}
```

### 12.2 Restaurants

**Endpoint:** `GET /restaurants`
```json
Query Parameters:
  - lat: 40.7128
  - lng: -74.0060
  - radius: 5000 (meters)
  - cuisine: italian,chinese
  - service_type: delivery,pickup,dine_in
  - min_rating: 4.0
  - sort_by: rating,distance,delivery_time

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Pizza Palace",
      "cuisine": ["Italian", "Pizza"],
      "rating": 4.5,
      "total_reviews": 234,
      "distance": 1.2,
      "delivery_fee": 2.99,
      "delivery_time": "25-35 min",
      "is_open": true,
      "image": "https://...",
      "service_types": ["delivery", "pickup"]
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 45
  }
}
```

**Endpoint:** `GET /restaurants/{id}/menu`
```json
Response (200):
{
  "success": true,
  "restaurant": {...},
  "categories": [
    {
      "id": 1,
      "name": "Appetizers",
      "items": [
        {
          "id": 1,
          "name": "Garlic Bread",
          "description": "Freshly baked...",
          "price": 5.99,
          "image": "https://...",
          "is_vegetarian": true,
          "is_available": true,
          "customizations": [...]
        }
      ]
    }
  ]
}
```

### 12.3 Orders

**Endpoint:** `POST /orders`
```json
Request:
{
  "restaurant_id": 1,
  "service_type": "delivery",
  "items": [
    {
      "menu_item_id": 1,
      "quantity": 2,
      "customizations": [{"id": 1, "option_id": 3}]
    }
  ],
  "delivery_address": {
    "address": "123 Main St",
    "lat": 40.7128,
    "lng": -74.0060,
    "instructions": "Ring doorbell"
  },
  "payment_method": "stripe",
  "coupon_code": "SAVE10"
}

Response (201):
{
  "success": true,
  "order": {
    "id": 123,
    "order_number": "ORD-2025-00123",
    "status": "pending",
    "subtotal": 25.98,
    "delivery_fee": 2.99,
    "discount": 2.60,
    "tax": 2.35,
    "total": 28.72,
    "estimated_delivery_time": "2025-11-13T15:30:00Z"
  },
  "payment_intent": "pi_xxx" // For Stripe
}
```

**Endpoint:** `GET /orders/{id}`
```json
Response (200):
{
  "success": true,
  "order": {
    "id": 123,
    "order_number": "ORD-2025-00123",
    "status": "preparing",
    "created_at": "2025-11-13T14:00:00Z",
    "restaurant": {...},
    "items": [...],
    "delivery_address": {...},
    "delivery_partner": {
      "id": 45,
      "name": "Mike Wilson",
      "phone": "+1234567890",
      "current_location": {
        "lat": 40.7120,
        "lng": -74.0050
      }
    },
    "timeline": [
      {"status": "placed", "timestamp": "14:00:00"},
      {"status": "confirmed", "timestamp": "14:02:15"},
      {"status": "preparing", "timestamp": "14:05:30"}
    ]
  }
}
```

**Endpoint:** `GET /orders`
```json
Query Parameters:
  - status: pending,confirmed,preparing,completed
  - page: 1

Response (200):
{
  "success": true,
  "data": [...],
  "meta": {...}
}
```

### 12.4 Real-Time Tracking

**Endpoint:** `GET /orders/{id}/tracking`
```json
Response (200):
{
  "success": true,
  "delivery_partner": {
    "name": "Mike Wilson",
    "phone": "+1234567890",
    "vehicle": "Motorcycle",
    "current_location": {
      "lat": 40.7120,
      "lng": -74.0050,
      "updated_at": "2025-11-13T14:25:30Z"
    }
  },
  "estimated_arrival": "2025-11-13T14:35:00Z",
  "route": {
    "distance_remaining": 0.8,
    "duration_remaining": 8
  }
}
```

### 12.5 Reviews

**Endpoint:** `POST /orders/{id}/review`
```json
Request:
{
  "rating": 5,
  "comment": "Great food and fast delivery!",
  "food_rating": 5,
  "delivery_rating": 4
}

Response (201):
{
  "success": true,
  "review": {...}
}
```

### 12.6 Restaurant Owner Endpoints

**Endpoint:** `GET /restaurant/dashboard`
**Endpoint:** `GET /restaurant/orders`
**Endpoint:** `PUT /restaurant/orders/{id}/status`
**Endpoint:** `POST /restaurant/menu/items`
**Endpoint:** `GET /restaurant/reports/sales`

### 12.7 Delivery Partner Endpoints

**Endpoint:** `GET /delivery/available-orders`
**Endpoint:** `POST /delivery/orders/{id}/accept`
**Endpoint:** `PUT /delivery/location`
**Endpoint:** `GET /delivery/earnings`

---

## 13. Database Architecture

### 13.1 Core Tables

**users**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255),
    role ENUM('admin','restaurant_owner','delivery','customer','waiter'),
    email_verified_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    fcm_token TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**restaurants**
```sql
CREATE TABLE restaurants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    owner_id BIGINT,
    name VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    phone VARCHAR(20),
    email VARCHAR(255),
    cuisine_types JSON,
    service_types JSON, -- ['delivery','pickup','dine_in']
    commission_rate DECIMAL(5,2),
    delivery_fee DECIMAL(8,2),
    min_order_amount DECIMAL(8,2),
    avg_rating DECIMAL(3,2),
    total_reviews INT,
    is_active BOOLEAN,
    is_open BOOLEAN,
    opening_time TIME,
    closing_time TIME,
    logo VARCHAR(255),
    banner_image VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

**menu_categories**
```sql
CREATE TABLE menu_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id BIGINT,
    name VARCHAR(255),
    description TEXT,
    display_order INT,
    is_active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

**menu_items**
```sql
CREATE TABLE menu_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id BIGINT,
    category_id BIGINT,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(8,2),
    image VARCHAR(255),
    is_vegetarian BOOLEAN,
    is_vegan BOOLEAN,
    is_available BOOLEAN,
    preparation_time INT, -- minutes
    calories INT,
    allergens JSON,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (category_id) REFERENCES menu_categories(id)
);
```

**orders**
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE,
    customer_id BIGINT,
    restaurant_id BIGINT,
    delivery_partner_id BIGINT,
    service_type ENUM('delivery','pickup','dine_in'),
    status ENUM('pending','confirmed','preparing','ready','out_for_delivery','completed','cancelled'),
    subtotal DECIMAL(10,2),
    delivery_fee DECIMAL(8,2),
    tax DECIMAL(8,2),
    discount DECIMAL(8,2),
    total DECIMAL(10,2),
    commission_amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_status ENUM('pending','completed','failed','refunded'),
    delivery_address JSON,
    special_instructions TEXT,
    estimated_delivery_time TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
    FOREIGN KEY (delivery_partner_id) REFERENCES users(id)
);
```

**order_items**
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT,
    menu_item_id BIGINT,
    quantity INT,
    unit_price DECIMAL(8,2),
    customizations JSON,
    subtotal DECIMAL(8,2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

**transactions**
```sql
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    order_id BIGINT,
    type ENUM('payment','commission','withdrawal','refund'),
    amount DECIMAL(10,2),
    status ENUM('pending','completed','failed'),
    payment_gateway VARCHAR(50),
    transaction_id VARCHAR(255),
    metadata JSON,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

**reviews**
```sql
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT,
    customer_id BIGINT,
    restaurant_id BIGINT,
    rating INT, -- 1-5
    food_rating INT,
    delivery_rating INT,
    comment TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

### 13.2 Entity Relationship Diagram (Simplified)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    users    │◄───────│restaurants │◄───────│menu_categories│
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │                       │                       │
       │                ┌──────▼──────┐         ┌──────▼──────┐
       │                │menu_items   │         │order_items  │
       │                └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       ├───────────────────────┼───────────────────────┘
       │                       │
       │                ┌──────▼──────┐
       └───────────────►│   orders    │
                        └──────┬──────┘
                               │
                        ┌──────┴──────┐
                        │             │
                  ┌─────▼─────┐ ┌────▼─────┐
                  │transactions│ │ reviews  │
                  └────────────┘ └──────────┘
```

### 13.3 Key Indexes

```sql
-- Performance optimization indexes
CREATE INDEX idx_restaurants_location ON restaurants(latitude, longitude);
CREATE INDEX idx_orders_customer ON orders(customer_id, created_at);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id, status, created_at);
CREATE INDEX idx_orders_delivery ON orders(delivery_partner_id, status);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id, is_available);
CREATE INDEX idx_transactions_user ON transactions(user_id, created_at);
```

---

## 14. Security Considerations

### 14.1 Authentication & Authorization

**Implemented Security Measures:**
- JWT token-based authentication
- Password hashing (bcrypt)
- Email verification
- Role-based access control (RBAC)
- API rate limiting
- CSRF protection
- XSS prevention

### 14.2 Data Protection

**Measures:**
- Input validation & sanitization
- SQL injection prevention (Eloquent ORM)
- Encrypted sensitive data
- HTTPS enforcement
- Secure payment gateway integration
- PCI DSS compliance for payments

### 14.3 API Security

**Best Practices:**
- Token expiration & refresh
- Request throttling
- IP whitelisting (admin)
- API versioning
- Audit logging
- Error message sanitization

### 14.4 Common Vulnerabilities Prevention

**Protection Against:**
- SQL Injection: Eloquent ORM, prepared statements
- XSS: Output escaping, Content Security Policy
- CSRF: Token validation
- Authentication bypass: Middleware checks
- File upload vulnerabilities: Type/size validation
- Session hijacking: Secure cookies, HTTPOnly flags

---

## 15. Quick Start Guide

### 15.1 For New Developers

**Day 1: Environment Setup**
1. Clone repository
2. Install dependencies (Composer, npm, Flutter)
3. Configure .env file
4. Run migrations & seeders
5. Start development server

**Day 2-3: Understand Architecture**
1. Review this documentation
2. Explore database schema
3. Test API endpoints (Postman)
4. Run through user flows in mobile apps

**Day 4-5: First Contribution**
1. Pick a small task/bug
2. Create feature branch
3. Write tests
4. Submit pull request

### 15.2 Common Commands

**Laravel:**
```bash
php artisan serve                    # Start dev server
php artisan migrate                  # Run migrations
php artisan db:seed                  # Seed database
php artisan queue:work               # Process jobs
php artisan cache:clear              # Clear cache
php artisan route:list               # View all routes
php artisan tinker                   # REPL console
```

**Flutter:**
```bash
flutter doctor                       # Check setup
flutter pub get                      # Install packages
flutter run                          # Run app
flutter build apk                    # Build Android APK
flutter test                         # Run tests
flutter clean                        # Clean build files
```

### 15.3 Troubleshooting

**Issue: Database connection error**
```bash
# Check credentials in .env
# Ensure MySQL is running
sudo systemctl status mysql
```

**Issue: Permission denied errors**
```bash
# Fix Laravel permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

**Issue: Queue jobs not processing**
```bash
# Restart queue worker
php artisan queue:restart
# Check Supervisor status
supervisorctl status foodbank-worker:*
```

**Issue: Mobile app can't connect to API**
```bash
# Check API_BASE_URL in mobile app config
# Ensure API is accessible from device/emulator
# Check firewall rules
```

---

## Appendix A: Glossary

**Terms:**
- **Multi-tenant:** Single application serving multiple independent customers
- **JWT:** JSON Web Token for stateless authentication
- **FCM:** Firebase Cloud Messaging for push notifications
- **ORM:** Object-Relational Mapping (Eloquent in Laravel)
- **CRUD:** Create, Read, Update, Delete operations
- **API:** Application Programming Interface
- **REST:** Representational State Transfer architecture

---

## Appendix B: External Resources

**Official Documentation:**
- Laravel: https://laravel.com/docs
- Flutter: https://flutter.dev/docs
- FoodBank: https://docs.food-bank.xyz

**Community:**
- Vendor: nullphpscript.com
- Developer: iNiLabs

---

## Appendix C: Change Log

**Version 3.4 (Current):**
- Repository structure documented
- Git LFS integration

**Version 3.3:**
- Responsive design fixes
- Minor bug corrections
- Updated July 2025

**Version 2.3:**
- Laravel 10 upgrade
- Livewire 3 integration

---

## Appendix D: Contact & Support

**Technical Support:**
- Documentation: https://docs.food-bank.xyz
- Developer: iNiLabs

**License:**
- Type: Commercial (iNiLabs)
- Activation: Required per domain

---

**Document End**

*This documentation was generated through comprehensive codebase analysis on November 13, 2025. For the most up-to-date information, always refer to the official documentation at https://docs.food-bank.xyz*
