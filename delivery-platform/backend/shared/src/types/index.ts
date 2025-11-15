// User Types
export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  DRIVER = 'driver',
  ADMIN = 'admin'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification'
}

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  firstName: string;
  lastName: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export enum OrderCategory {
  FOOD = 'food',
  GROCERY = 'grocery',
  PHARMACY = 'pharmacy',
  MEAT_SEAFOOD = 'meat_seafood',
  RETAIL = 'retail'
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  vendorId: string;
  driverId?: string;
  category: OrderCategory;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryAddress: Address;
  specialInstructions?: string;
  estimatedDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: OrderItemModifier[];
  specialInstructions?: string;
}

export interface OrderItemModifier {
  name: string;
  value: string;
  price: number;
}

// Address Type
export interface Address {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

// Vendor Types
export enum VendorStatus {
  PENDING_APPROVAL = 'pending_approval',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  category: OrderCategory;
  status: VendorStatus;
  description: string;
  address: Address;
  phone: string;
  email: string;
  logo?: string;
  coverImage?: string;
  rating: number;
  totalOrders: number;
  commissionRate: number;
  isOnline: boolean;
  openingHours?: OpeningHours;
  createdAt: Date;
  updatedAt: Date;
}

export interface OpeningHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  open: string; // HH:MM format
  close: string; // HH:MM format
  closed?: boolean;
}

// Driver Types
export enum DriverStatus {
  PENDING_APPROVAL = 'pending_approval',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export enum VehicleType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  BICYCLE = 'bicycle',
  SCOOTER = 'scooter'
}

export interface Driver {
  id: string;
  userId: string;
  status: DriverStatus;
  vehicleType: VehicleType;
  vehiclePlate: string;
  licenseNumber: string;
  rating: number;
  totalDeliveries: number;
  isOnline: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Payment Types
export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  CASH = 'cash',
  WALLET = 'wallet'
}

export enum PaymentStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Event Types for Kafka
export enum EventType {
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  ORDER_CREATED = 'order.created',
  ORDER_CONFIRMED = 'order.confirmed',
  ORDER_PREPARING = 'order.preparing',
  ORDER_READY = 'order.ready',
  ORDER_PICKED_UP = 'order.picked_up',
  ORDER_DELIVERED = 'order.delivered',
  ORDER_CANCELLED = 'order.cancelled',
  DRIVER_ASSIGNED = 'driver.assigned',
  DRIVER_LOCATION_UPDATED = 'driver.location.updated',
  PAYMENT_COMPLETED = 'payment.completed',
  NOTIFICATION_SEND = 'notification.send'
}

export interface Event<T = any> {
  type: EventType;
  data: T;
  timestamp: Date;
  id: string;
}
