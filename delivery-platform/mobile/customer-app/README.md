# QuickDeliver Customer App

React Native mobile application for customers to order from multiple vendors.

## Features

- 🏠 **Home Screen**: Browse vendors by category with search and filters
- 🍕 **Vendor Details**: View menu items with categories and add to cart
- 🛒 **Cart Management**: Add, remove, update quantities
- 💳 **Checkout**: Delivery address, payment method selection
- 📍 **Real-time Tracking**: WebSocket-based live order and driver tracking
- 📜 **Order History**: View past orders
- 👤 **Profile**: Manage addresses, payment methods, settings

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: Zustand
- **API Client**: Axios
- **Real-time**: Socket.IO
- **Maps**: React Native Maps
- **Payments**: Stripe React Native SDK
- **Notifications**: Expo Notifications

## Setup

### Prerequisites

```bash
node >= 18
npm or yarn
Expo CLI: npm install -g expo-cli
```

### Installation

```bash
cd mobile/customer-app
npm install
```

### Environment Variables

Create `.env` file:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_TRACKING_WS_URL=http://localhost:3006
EXPO_PUBLIC_ORDER_WS_URL=http://localhost:3002
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Run

```bash
# Start Expo
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## Project Structure

```
src/
├── api/              # API client and endpoints
│   ├── client.ts     # Axios instance with interceptors
│   ├── auth.ts       # Authentication APIs
│   ├── vendor.ts     # Vendor and menu APIs
│   └── order.ts      # Order management APIs
├── screens/          # App screens
│   ├── auth/         # Login, Signup
│   ├── home/         # Home screen with vendor list
│   ├── vendor/       # Vendor detail, menu
│   ├── cart/         # Shopping cart
│   ├── checkout/     # Checkout flow
│   ├── order/        # Order tracking, history
│   ├── search/       # Search screen
│   └── profile/      # User profile
├── store/            # Zustand state management
│   ├── authStore.ts  # Auth state
│   └── cartStore.ts  # Cart state
├── theme/            # Design system
│   ├── colors.ts     # Color palette
│   └── typography.ts # Typography styles
└── utils/            # Utility functions
```

## Key Features Implementation

### Authentication

- JWT token storage in AsyncStorage
- Auto-refresh tokens
- Auth interceptor for API requests

### Real-time Order Tracking

- WebSocket connection to tracking service
- Live driver location updates
- ETA calculation
- Order status updates

### Cart Management

- Multi-vendor cart (clears when switching vendors)
- Persistent state with Zustand
- Quantity management
- Price calculation with tax and delivery fee

### Push Notifications

- Firebase Cloud Messaging integration
- Order status notifications
- Delivery updates

## Building for Production

### iOS

```bash
expo build:ios
```

### Android

```bash
expo build:android
```

## Dependencies

See `package.json` for full list.

Key dependencies:
- `react-native`: 0.73.2
- `expo`: ~50.0.0
- `@react-navigation/native`: ^6.1.9
- `zustand`: ^4.4.7
- `axios`: ^1.6.5
- `socket.io-client`: ^4.6.1
- `react-native-maps`: 1.10.0
- `@stripe/stripe-react-native`: 0.35.1

## API Endpoints

### Authentication
- `POST /auth/login`
- `POST /auth/signup`
- `POST /auth/logout`

### Vendors
- `GET /vendors/search?category=food&lat=40.7128&lng=-74.0060`
- `GET /vendors/:id`
- `GET /vendors/:id/menu`

### Orders
- `POST /orders`
- `GET /orders/:id`
- `GET /orders/user/:userId`
- `POST /orders/:id/cancel`

### Tracking
- WebSocket: `ws://localhost:3006`
- Events: `join:order`, `driver:location`, `order:status`

## Troubleshooting

### Maps not showing

1. Add Google Maps API key in `app.json`
2. Enable Maps SDK for iOS/Android in Google Cloud Console

### WebSocket connection fails

Check that tracking service is running on port 3006

### Build errors

```bash
# Clear cache
expo start -c

# Reset dependencies
rm -rf node_modules package-lock.json
npm install
```

## License

MIT
