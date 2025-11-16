# 6amMart Project Overview

## Project Information
- **Name**: 6amMart v3.4 (Momux Edition)
- **Type**: Multi-vendor Delivery Platform
- **Version**: 3.4
- **Distribution**: Momux (served by Mehedi15)
- **Repository**: https://github.com/syedghousuddin8-cyber/6am

## Description
6amMart is a comprehensive multi-vendor platform that supports multiple business verticals:
- Food Delivery
- Grocery Delivery
- eCommerce
- Parcel Delivery
- Pharmacy Delivery

This is a commercial white-label solution that can be customized and deployed for various delivery-based businesses.

## Architecture Overview

The project consists of **TWO main components**:

### 1. Admin Panel (Laravel Backend)
**Location**: `Main-6ammart-3.4-Momux/Main/Admin panel new install V3.4-nf/`

**Technology Stack**:
- **Framework**: Laravel (PHP 8.2+)
- **Architecture**: MVC with Modular design
- **Database**: MySQL (with 204 migrations)
- **Real-time**: Laravel WebSockets

**Key Features**:
- Modular architecture (AI Module, Tax Module)
- Repository pattern implementation
- Service layer architecture
- WebSocket support for real-time features
- Comprehensive admin panel
- Multi-language support
- Payment gateway integrations

**Directory Structure**:
```
Admin panel/
├── app/
│   ├── CentralLogics/       # Core business logic
│   ├── Http/                # Controllers, Middleware
│   ├── Models/              # 30+ Eloquent models
│   ├── Repositories/        # Data layer
│   ├── Services/            # Business services
│   ├── Exports/             # Data export functionality
│   ├── Mail/                # Email templates
│   ├── Observers/           # Model observers
│   └── WebSockets/          # Real-time functionality
├── Modules/
│   ├── AI/                  # AI integration module
│   └── TaxModule/           # Tax calculation module
├── database/
│   └── migrations/          # 204 database migrations
├── routes/
│   ├── api/                 # API routes
│   ├── admin/               # Admin routes
│   ├── vendor/              # Vendor routes
│   ├── rest_api/            # REST API routes
│   └── web/                 # Web routes
├── resources/               # Views and assets
└── config/                  # Configuration files
```

**Key Models** (Sample):
- User, Admin, Vendor
- Store, Category, Item
- Order, OrderDetail
- Campaign, Banner
- Coupon, CashBack
- Delivery, Zone
- Payment, Transaction
- Notification, Chat
- Review, Rating
- Advertisement

### 2. User App & Web (Flutter Frontend)
**Location**: `Main-6ammart-3.4-Momux/Main/User app and web/`

**Technology Stack**:
- **Framework**: Flutter 3.35.6
- **SDK**: Dart (>=3.2.0 <4.0.0)
- **State Management**: GetX
- **Architecture**: Feature-based modular architecture

**Platforms**:
- Android (APK)
- iOS (IPA)
- Web (PWA capable)

**Key Dependencies**:
- **State Management**: GetX (^4.7.2)
- **Maps**: Google Maps Flutter
- **Authentication**: Firebase Auth, Google Sign In, Facebook Auth, Apple Sign In
- **Push Notifications**: Firebase Cloud Messaging
- **Payments**: Multiple payment gateway integrations
- **Local Storage**: Shared Preferences, Drift (SQLite)
- **Media**: Image Picker, Video Player, Audio Players
- **UI Components**: Carousel Slider, Shimmer Animation, Lottie
- **Location**: Geolocator, Location
- **Communication**: HTTP, Web Sockets

**Feature Modules** (48 features):
```
lib/features/
├── address/              # Address management
├── auth/                 # Authentication & authorization
├── banner/               # Banner/promotional displays
├── brands/               # Brand management
├── business/             # Business/store management
├── cart/                 # Shopping cart
├── category/             # Category browsing
├── chat/                 # In-app messaging
├── checkout/             # Order checkout
├── coupon/               # Coupon/discount codes
├── dashboard/            # Main dashboard
├── favourite/            # Wishlist/favorites
├── flash_sale/           # Flash sale events
├── home/                 # Home screen
├── html/                 # HTML content viewer
├── interest/             # User interests
├── item/                 # Product/item management
├── language/             # Multi-language support
├── location/             # Location services
├── loyalty/              # Loyalty program
├── menu/                 # Navigation menu
├── notification/         # Push notifications
├── onboard/              # Onboarding flow
├── online_payment/       # Payment processing
├── order/                # Order management
├── parcel/               # Parcel delivery
├── payment/              # Payment methods
├── profile/              # User profile
├── refer_and_earn/       # Referral program
├── rental_module/        # Rental services
├── review/               # Rating & reviews
├── search/               # Search functionality
├── splash/               # Splash screen
├── store/                # Store/vendor pages
├── support/              # Customer support
├── update/               # App updates
├── verification/         # User verification
└── wallet/               # Digital wallet
```

**Additional Directories**:
- `api/` - API client and services
- `common/` - Shared widgets, models, controllers
- `helper/` - Utility functions
- `theme/` - App theming
- `util/` - Constants and utilities
- `interfaces/` - Repository interfaces
- `local/` - Local database (Drift)

## Database Structure
The platform uses a comprehensive database schema with **204 migrations**, supporting:
- Multi-vendor management
- Multi-store operations
- Inventory management
- Order processing
- Payment processing
- User management
- Delivery management
- Analytics and reporting
- Promotional campaigns
- Customer loyalty programs
- Multi-currency support
- Tax calculation
- Commission management

## Key Functionalities

### For Customers:
- Browse multiple stores and categories
- Search and filter products
- Add items to cart
- Apply coupons and discounts
- Multiple payment methods
- Real-time order tracking
- Chat with stores/delivery personnel
- Rate and review orders
- Loyalty points and wallet
- Refer and earn
- Schedule deliveries
- Multi-language support

### For Vendors/Stores:
- Store management dashboard
- Product/inventory management
- Order management
- Sales analytics
- Promotional campaigns
- Customer communication
- Delivery assignment
- Revenue tracking

### For Admin:
- Multi-vendor platform management
- Store approval and management
- User management
- Order oversight
- Commission management
- Analytics and reports
- Campaign management
- Payment gateway configuration
- Zone and delivery management
- Content management
- Settings and configurations

### For Delivery Personnel:
- Order assignments
- Navigation and routing
- Real-time status updates
- Earnings tracking

## Third-party Integrations
- **Maps**: Google Maps API
- **Authentication**: Firebase, Google, Facebook, Apple
- **Notifications**: Firebase Cloud Messaging
- **Payments**: Multiple payment gateways
- **Analytics**: Firebase Crashlytics
- **Storage**: Local (Drift/SQLite) and Cloud
- **Media**: Image and video processing

## Installation Requirements

### Backend (Laravel):
- PHP 8.2+
- MySQL database
- Composer
- Web server (Apache/Nginx)
- Node.js (for asset compilation)

### Frontend (Flutter):
- Flutter SDK 3.35.6
- Dart SDK 3.2.0+
- Android Studio / Xcode
- Firebase account
- Google Maps API key

## Documentation
Official documentation available at: https://6ammart.app/documentation/

## Security Notes
This is a commercial product distributed by Momux. The repository includes:
- Password-protected archive (Password: VAg7mMXn9Z)
- Installation instructions
- Configuration guidelines

## Services Offered by Distributor (Mehedi15)
- Complete installation and setup
- Admin panel configuration
- Android (APK) and iOS (IPA) builds
- Google Play & App Store publishing
- 3rd-party API integrations (Maps, Firebase, Payment Gateways)
- Reskinning and customization

## Contact Information
- **WhatsApp**: http://wa.link/p5q9d1
- **Telegram**: https://t.me/mehedidev
- **Website**: https://momux.in

## Business Model
This is a **white-label multi-vendor marketplace platform** that can be customized for:
- Food delivery businesses (like Uber Eats, DoorDash)
- Grocery delivery (like Instacart)
- General eCommerce marketplaces
- Pharmacy delivery
- Parcel/courier services
- Or any combination of the above

The platform supports commission-based revenue models and subscription-based vendor plans.

## Technology Highlights
- **Mobile-First Design**: Flutter enables native performance on Android, iOS, and Web
- **Modular Architecture**: Both backend and frontend use modular design for scalability
- **Real-time Features**: WebSocket support for live updates
- **Offline Capability**: Local database support for offline operations
- **Multi-tenant**: Supports multiple vendors with isolated data
- **Scalable**: Repository pattern and service layer for maintainability
- **Modern Stack**: Latest versions of Laravel and Flutter

## Project Scale
- **Total Files**: 7,051 files
- **Backend Migrations**: 204 database migrations
- **Frontend Features**: 48 feature modules
- **Models**: 30+ Eloquent models
- **Languages**: PHP, Dart, Blade, JavaScript
- **Code Distribution**: Blade (46.7%), PHP (31.5%), Dart (17.9%), C/C++ (3%), Other (1%)
