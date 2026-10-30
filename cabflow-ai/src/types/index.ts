export type Language = 'en' | 'mr' | 'hi';

export type UserRole = 'admin' | 'staff' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string | null;
}

export type RideStatus = 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Booking {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  destination: string;
  booking_time: string;
  vehicle_id?: string | null;
  driver_id?: string | null;
  estimated_fare: number;
  ride_status: RideStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export type VehicleType = 'Sedan' | 'SUV' | 'Hatchback' | 'Premium';
export type VehicleStatus = 'available' | 'on_trip' | 'maintenance';

export interface Vehicle {
  id: string;
  registration_number: string;
  type: VehicleType;
  make_model: string;
  seating_capacity: number;
  assigned_driver_id?: string | null;
  status: VehicleStatus;
  maintenance_notes?: string;
  created_at: string;
}

export type DriverStatus = 'available' | 'on_duty' | 'off_duty';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  license_number: string;
  license_expiry: string;
  status: DriverStatus;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  created_at: string;
  totalRides?: number;
  completedRides?: number;
  totalSpent?: number;
}

export type PaymentMethod = 'UPI' | 'Card' | 'Cash' | 'NetBanking';
export type PaymentRecordStatus = 'Success' | 'Pending' | 'Failed';

export interface Payment {
  id: string;
  booking_id: string;
  customer_name: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentRecordStatus;
  transaction_ref: string;
  is_demo: boolean;
  payment_date: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string | null;
  action_type: string;
  entity_type: string;
  entity_id?: string | null;
  description: string;
  metadata?: any;
  created_at: string;
}

export interface DashboardSummary {
  kpis: {
    totalBookings: number;
    activeRides: number;
    availableVehicles: number;
    totalVehicles: number;
    totalDrivers: number;
    totalCustomers: number;
    totalRevenue: number;
    pendingPaymentsCount: number;
    pendingPaymentsAmount: number;
    completedRides: number;
    cancelledRides: number;
  };
  recentBookings: Booking[];
  revenueOverview: { date: string; revenue: number; bookings: number }[];
  statusCounts: Record<string, number>;
  vehicleByType: Record<string, { total: number; available: number }>;
  latestActivity: ActivityLog[];
}

export interface DBHealth {
  status: string;
  engine: string;
  isConnectedToMySQL: boolean;
  connectionError: string | null;
  records: {
    bookings: number;
    vehicles: number;
    drivers: number;
    customers: number;
    payments: number;
    activity_logs: number;
  };
  dbHost: string;
  timestamp: string;
}

export type NavTab =
  | 'dashboard'
  | 'bookings'
  | 'fleet'
  | 'drivers'
  | 'customers'
  | 'payments'
  | 'reports'
  | 'activity'
  | 'settings';
