# Admin Dashboard - Multi-Vendor Delivery Platform

Production-ready web-based admin dashboard for managing the multi-vendor delivery platform.

## Features

### 📊 Real-Time Dashboard
- Live statistics and metrics
- Revenue trends and charts
- Order monitoring with auto-refresh
- Pending approvals alerts
- Recent orders feed

### 🏪 Vendor Management
- Vendor registration approvals
- Business profile review
- Performance metrics (rating, orders, revenue)
- Online/offline status monitoring
- Block/unblock functionality
- Search and filtering

### 🚗 Driver Management
- Driver registration approvals
- Document verification
- Vehicle information management
- Performance tracking (deliveries, earnings, rating)
- Online/offline status
- Block/unblock functionality

### 📦 Order Monitoring
- Real-time order tracking
- Order status management
- Order cancellation
- Refund processing
- Detailed order information
- Payment status tracking
- Search and filtering by status

### 📈 Analytics & Reports
- Revenue trends and forecasting
- Order status distribution
- Category performance analysis
- Top vendors and drivers
- Peak hours analysis
- Exportable reports (PDF/CSV)

### 👥 User Management
- Customer listing and management
- Admin user creation
- User blocking/unblocking
- Activity monitoring
- Role-based access control

### ⚙️ System Settings
- Platform fee configuration
- Tax rate settings
- Delivery fee structure
- Surge pricing configuration
- Auto-approval settings
- Minimum order amounts
- Delivery radius limits

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Routing:** React Router v6
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **Real-Time:** Socket.IO Client
- **Charts:** Recharts
- **UI Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Date Handling:** date-fns

## Getting Started

### Prerequisites

- Node.js 20+ and npm/yarn
- Backend API running (see `/backend` directory)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update environment variables:
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3002
```

### Development

Start the development server:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
admin-dashboard/
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── DashboardLayout.tsx    # Main layout with sidebar
│   ├── hooks/
│   │   ├── useDashboard.ts            # Dashboard data hooks
│   │   ├── useVendors.ts              # Vendor management hooks
│   │   ├── useDrivers.ts              # Driver management hooks
│   │   └── useOrders.ts               # Order management hooks
│   ├── lib/
│   │   ├── api.ts                     # Axios instance with interceptors
│   │   └── utils.ts                   # Utility functions
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx          # Admin login
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx      # Main dashboard
│   │   ├── vendors/
│   │   │   └── VendorsPage.tsx        # Vendor management
│   │   ├── drivers/
│   │   │   └── DriversPage.tsx        # Driver management
│   │   ├── orders/
│   │   │   └── OrdersPage.tsx         # Order monitoring
│   │   ├── analytics/
│   │   │   └── AnalyticsPage.tsx      # Analytics & reports
│   │   ├── users/
│   │   │   └── UsersPage.tsx          # User management
│   │   └── settings/
│   │       └── SettingsPage.tsx       # Platform settings
│   ├── store/
│   │   └── authStore.ts               # Authentication state
│   ├── App.tsx                        # App router
│   ├── main.tsx                       # App entry point
│   └── index.css                      # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Features in Detail

### Authentication
- JWT-based authentication
- Role-based access (admin only)
- Auto token refresh
- Protected routes
- Session persistence

### Real-Time Updates
- Auto-refreshing dashboard metrics (30s)
- Real-time order monitoring (10s)
- Live notifications
- WebSocket support for instant updates

### Data Management
- Optimistic updates
- Automatic cache invalidation
- Pagination support
- Advanced search and filtering
- Export functionality

### User Experience
- Responsive design (mobile, tablet, desktop)
- Loading states
- Error handling
- Toast notifications
- Confirmation dialogs
- Keyboard shortcuts support

## API Integration

The dashboard integrates with the following API endpoints:

### Authentication
- `POST /api/v1/auth/login` - Admin login

### Dashboard
- `GET /api/v1/admin/stats` - Dashboard statistics
- `GET /api/v1/admin/orders/recent` - Recent orders
- `GET /api/v1/admin/analytics/revenue` - Revenue data

### Vendors
- `GET /api/v1/vendors` - List vendors
- `GET /api/v1/vendors/:id` - Get vendor details
- `PATCH /api/v1/admin/vendors/:id/status` - Update status
- `POST /api/v1/admin/vendors/:id/block` - Block vendor

### Drivers
- `GET /api/v1/drivers` - List drivers
- `PATCH /api/v1/admin/drivers/:id/status` - Update status
- `POST /api/v1/admin/drivers/:id/verify-documents` - Verify docs
- `POST /api/v1/admin/drivers/:id/block` - Block driver

### Orders
- `GET /api/v1/admin/orders` - List orders
- `GET /api/v1/admin/orders/:id` - Get order details
- `POST /api/v1/admin/orders/:id/cancel` - Cancel order
- `POST /api/v1/admin/orders/:id/refund` - Process refund

### Analytics
- `GET /api/v1/admin/analytics` - Analytics data
- `GET /api/v1/admin/analytics/export` - Export reports

### Users
- `GET /api/v1/admin/users` - List users
- `POST /api/v1/admin/users` - Create admin user
- `POST /api/v1/admin/users/:id/block` - Block user
- `POST /api/v1/admin/users/:id/unblock` - Unblock user

### Settings
- `GET /api/v1/admin/settings` - Get settings
- `PUT /api/v1/admin/settings` - Update settings

## Security Features

- JWT token-based authentication
- Automatic token refresh
- Protected routes with role verification
- HTTPS only in production
- XSS protection
- CSRF protection
- Input validation
- Secure password handling
- Rate limiting integration

## Performance Optimizations

- Code splitting by route
- Lazy loading of components
- Image optimization
- Bundle size optimization
- React Query caching
- Debounced search inputs
- Virtual scrolling for large lists
- Memoized components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Environment Variables

Set the following environment variables in production:

```env
VITE_API_URL=https://api.yourplatform.com
VITE_WS_URL=wss://ws.yourplatform.com
```

### Build and Deploy

```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting service
# (Netlify, Vercel, AWS S3 + CloudFront, etc.)
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name admin.yourplatform.com;

    root /var/www/admin-dashboard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use custom hooks for reusable logic

### State Management
- Use Zustand for global state
- Use TanStack Query for server state
- Use local state for component-specific data

### Naming Conventions
- Components: PascalCase (e.g., `DashboardPage.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useVendors.ts`)
- Utils: camelCase (e.g., `formatCurrency`)
- Constants: UPPER_SNAKE_CASE

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify VITE_API_URL is correct
   - Check if backend is running
   - Verify CORS settings

2. **Authentication Issues**
   - Clear localStorage
   - Verify admin role in user data
   - Check token expiration

3. **Build Failures**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all dependencies are installed

## License

Copyright © 2025 Multi-Vendor Delivery Platform
