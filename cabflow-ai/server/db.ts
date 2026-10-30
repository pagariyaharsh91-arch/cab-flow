import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'staff' | 'viewer';
  avatar_url?: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  created_at: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  license_number: string;
  license_expiry: string;
  status: 'available' | 'on_duty' | 'off_duty';
  created_at: string;
}

export interface Vehicle {
  id: string;
  registration_number: string;
  type: 'Sedan' | 'SUV' | 'Hatchback' | 'Premium';
  make_model: string;
  seating_capacity: number;
  assigned_driver_id?: string | null;
  status: 'available' | 'on_trip' | 'maintenance';
  maintenance_notes?: string;
  created_at: string;
}

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
  ride_status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  payment_status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  customer_name: string;
  amount: number;
  method: 'UPI' | 'Card' | 'Cash' | 'NetBanking';
  status: 'Success' | 'Pending' | 'Failed';
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

export interface UserSettings {
  user_id: string;
  language: 'en' | 'mr' | 'hi';
  theme: 'light';
  notifications_enabled: boolean;
  currency: string;
}

export interface DatabaseStore {
  users: User[];
  customers: Customer[];
  drivers: Driver[];
  vehicles: Vehicle[];
  bookings: Booking[];
  payments: Payment[];
  activity_logs: ActivityLog[];
  settings: Record<string, UserSettings>;
}

const STORAGE_DIR = path.resolve(process.cwd(), 'data');
const STORAGE_FILE = path.join(STORAGE_DIR, 'cabflow_storage.json');

// Default initial hash for Admin@123
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('Admin@123', 10);

export function getInitialSeedData(): DatabaseStore {
  return {
    users: [
      {
        id: 'usr-001',
        name: 'Prof. Rajesh Kulkarni',
        email: 'admin@cabflow.ai',
        password_hash: DEFAULT_PASSWORD_HASH,
        role: 'admin',
        avatar_url: '/src/assets/images/admin_avatar_1792657023605.jpg',
        created_at: new Date('2026-10-20T08:00:00Z').toISOString(),
      },
      {
        id: 'usr-002',
        name: 'Ananya Deshmukh',
        email: 'staff@cabflow.ai',
        password_hash: DEFAULT_PASSWORD_HASH,
        role: 'staff',
        avatar_url: null,
        created_at: new Date('2026-10-21T09:00:00Z').toISOString(),
      },
      {
        id: 'usr-003',
        name: 'Guest Evaluator',
        email: 'viewer@cabflow.ai',
        password_hash: DEFAULT_PASSWORD_HASH,
        role: 'viewer',
        avatar_url: null,
        created_at: new Date('2026-10-22T08:00:00Z').toISOString(),
      },
    ],
    customers: [
      {
        id: 'CUST-101',
        name: 'Priya Sharma',
        phone: '+91 98201 12345',
        email: 'priya.sharma@example.com',
        address: 'Koregaon Park, Pune, MH',
        created_at: new Date('2026-10-18T10:00:00Z').toISOString(),
      },
      {
        id: 'CUST-102',
        name: 'Rahul Verma',
        phone: '+91 98902 23456',
        email: 'rahul.verma@example.com',
        address: 'Bandra West, Mumbai, MH',
        created_at: new Date('2026-10-19T11:20:00Z').toISOString(),
      },
      {
        id: 'CUST-103',
        name: 'Amit Joshi',
        phone: '+91 97654 34567',
        email: 'amit.joshi@example.com',
        address: 'Kothrud, Pune, MH',
        created_at: new Date('2026-10-20T14:30:00Z').toISOString(),
      },
      {
        id: 'CUST-104',
        name: 'Sneha Patil',
        phone: '+91 94220 45678',
        email: 'sneha.patil@example.com',
        address: 'Vashi, Navi Mumbai, MH',
        created_at: new Date('2026-10-21T09:15:00Z').toISOString(),
      },
      {
        id: 'CUST-105',
        name: 'Vikramaditya Roy',
        phone: '+91 91580 56789',
        email: 'vikram.roy@example.com',
        address: 'Hinjawadi Phase 1, Pune, MH',
        created_at: new Date('2026-10-21T12:00:00Z').toISOString(),
      },
      {
        id: 'CUST-106',
        name: 'Pooja Kulkarni',
        phone: '+91 93700 67890',
        email: 'pooja.k@example.com',
        address: 'Aundh, Pune, MH',
        created_at: new Date('2026-10-21T15:45:00Z').toISOString(),
      },
    ],
    drivers: [
      {
        id: 'DRV-201',
        name: 'Suresh Shinde',
        phone: '+91 98221 44556',
        email: 'suresh.shinde@cabflow.ai',
        license_number: 'MH-12-2018-0098431',
        license_expiry: '2028-06-15',
        status: 'available',
        created_at: new Date('2026-10-15T08:00:00Z').toISOString(),
      },
      {
        id: 'DRV-202',
        name: 'Ramesh Gaikwad',
        phone: '+91 94235 66778',
        email: 'ramesh.gaikwad@cabflow.ai',
        license_number: 'MH-14-2019-0056123',
        license_expiry: '2027-11-20',
        status: 'on_duty',
        created_at: new Date('2026-10-16T09:30:00Z').toISOString(),
      },
      {
        id: 'DRV-203',
        name: 'Sachin Pawar',
        phone: '+91 98901 88990',
        email: 'sachin.pawar@cabflow.ai',
        license_number: 'MH-01-2020-0012984',
        license_expiry: '2026-12-10', // Expiry approaching warning
        status: 'available',
        created_at: new Date('2026-10-17T10:15:00Z').toISOString(),
      },
      {
        id: 'DRV-204',
        name: 'Mahesh Jadhav',
        phone: '+91 97664 11223',
        email: 'mahesh.jadhav@cabflow.ai',
        license_number: 'MH-12-2017-0077889',
        license_expiry: '2029-03-30',
        status: 'available',
        created_at: new Date('2026-10-18T11:00:00Z').toISOString(),
      },
      {
        id: 'DRV-205',
        name: 'Sunil More',
        phone: '+91 91588 33445',
        email: 'sunil.more@cabflow.ai',
        license_number: 'MH-14-2016-0044556',
        license_expiry: '2027-08-14',
        status: 'off_duty',
        created_at: new Date('2026-10-19T13:40:00Z').toISOString(),
      },
    ],
    vehicles: [
      {
        id: 'VEH-301',
        registration_number: 'MH-12-RN-4589',
        type: 'Sedan',
        make_model: 'Hyundai Verna 1.5 Turbo',
        seating_capacity: 4,
        assigned_driver_id: 'DRV-201',
        status: 'available',
        maintenance_notes: 'Scheduled service completed. High performance.',
        created_at: new Date('2026-10-15T08:00:00Z').toISOString(),
      },
      {
        id: 'VEH-302',
        registration_number: 'MH-14-EQ-8921',
        type: 'SUV',
        make_model: 'Toyota Innova Crysta 2.4 VX',
        seating_capacity: 7,
        assigned_driver_id: 'DRV-202',
        status: 'on_trip',
        maintenance_notes: 'AC overhaul done. Passenger cabin sanitized.',
        created_at: new Date('2026-10-16T09:00:00Z').toISOString(),
      },
      {
        id: 'VEH-303',
        registration_number: 'MH-12-TX-1024',
        type: 'Hatchback',
        make_model: 'Maruti Suzuki Swift ZXi',
        seating_capacity: 4,
        assigned_driver_id: 'DRV-203',
        status: 'available',
        maintenance_notes: 'New brake pads installed. Fuel efficiency checked.',
        created_at: new Date('2026-10-17T11:20:00Z').toISOString(),
      },
      {
        id: 'VEH-304',
        registration_number: 'MH-01-EV-3301',
        type: 'Premium',
        make_model: 'Tata Nexon EV Max Prime',
        seating_capacity: 5,
        assigned_driver_id: 'DRV-204',
        status: 'available',
        maintenance_notes: 'Fast charging verified. Battery health 98%.',
        created_at: new Date('2026-10-18T14:10:00Z').toISOString(),
      },
      {
        id: 'VEH-305',
        registration_number: 'MH-12-BZ-7744',
        type: 'SUV',
        make_model: 'Mahindra XUV700 AX7',
        seating_capacity: 7,
        assigned_driver_id: null,
        status: 'maintenance',
        maintenance_notes: 'Quarterly wheel alignment and suspension inspection.',
        created_at: new Date('2026-10-19T16:00:00Z').toISOString(),
      },
    ],
    bookings: [
      {
        id: 'CB-8921',
        customer_id: 'CUST-101',
        customer_name: 'Priya Sharma',
        customer_phone: '+91 98201 12345',
        pickup_location: 'Pune Airport (PNQ), Lohegaon',
        destination: 'JW Marriott, Senapati Bapat Rd',
        booking_time: new Date('2026-10-22T09:30:00Z').toISOString(),
        vehicle_id: 'VEH-301',
        driver_id: 'DRV-201',
        estimated_fare: 850,
        ride_status: 'Confirmed',
        payment_status: 'Paid',
        created_at: new Date('2026-10-22T09:00:00Z').toISOString(),
        updated_at: new Date('2026-10-22T09:35:00Z').toISOString(),
      },
      {
        id: 'CB-8922',
        customer_id: 'CUST-102',
        customer_name: 'Rahul Verma',
        customer_phone: '+91 98902 23456',
        pickup_location: 'Chhatrapati Shivaji Terminal (CSMT)',
        destination: 'Bandra Kurla Complex (BKC)',
        booking_time: new Date('2026-10-22T10:15:00Z').toISOString(),
        vehicle_id: 'VEH-302',
        driver_id: 'DRV-202',
        estimated_fare: 620,
        ride_status: 'In Progress',
        payment_status: 'Pending',
        created_at: new Date('2026-10-22T09:45:00Z').toISOString(),
        updated_at: new Date('2026-10-22T10:15:00Z').toISOString(),
      },
      {
        id: 'CB-8923',
        customer_id: 'CUST-103',
        customer_name: 'Amit Joshi',
        customer_phone: '+91 97654 34567',
        pickup_location: 'Kothrud Stand, Pune',
        destination: 'Magarpatta Cybercity, Hadapsar',
        booking_time: new Date('2026-10-22T11:00:00Z').toISOString(),
        vehicle_id: 'VEH-304',
        driver_id: 'DRV-204',
        estimated_fare: 540,
        ride_status: 'Pending',
        payment_status: 'Pending',
        created_at: new Date('2026-10-22T10:00:00Z').toISOString(),
        updated_at: new Date('2026-10-22T10:00:00Z').toISOString(),
      },
      {
        id: 'CB-8920',
        customer_id: 'CUST-104',
        customer_name: 'Sneha Patil',
        customer_phone: '+91 94220 45678',
        pickup_location: 'Vashi Plaza, Navi Mumbai',
        destination: 'Domestic Airport T1, Mumbai',
        booking_time: new Date('2026-10-21T16:45:00Z').toISOString(),
        vehicle_id: 'VEH-303',
        driver_id: 'DRV-203',
        estimated_fare: 950,
        ride_status: 'Completed',
        payment_status: 'Paid',
        created_at: new Date('2026-10-21T15:30:00Z').toISOString(),
        updated_at: new Date('2026-10-21T17:30:00Z').toISOString(),
      },
      {
        id: 'CB-8919',
        customer_id: 'CUST-105',
        customer_name: 'Vikramaditya Roy',
        customer_phone: '+91 91580 56789',
        pickup_location: 'Hinjawadi Phase 3 Tech Park',
        destination: 'Shivajinagar Railway Station',
        booking_time: new Date('2026-10-21T18:20:00Z').toISOString(),
        vehicle_id: 'VEH-301',
        driver_id: 'DRV-201',
        estimated_fare: 780,
        ride_status: 'Completed',
        payment_status: 'Paid',
        created_at: new Date('2026-10-21T17:10:00Z').toISOString(),
        updated_at: new Date('2026-10-21T19:15:00Z').toISOString(),
      },
      {
        id: 'CB-8918',
        customer_id: 'CUST-106',
        customer_name: 'Pooja Kulkarni',
        customer_phone: '+91 93700 67890',
        pickup_location: 'Aundh Westend Mall',
        destination: 'Symbiosis College, Viman Nagar',
        booking_time: new Date('2026-10-20T14:10:00Z').toISOString(),
        vehicle_id: 'VEH-302',
        driver_id: 'DRV-202',
        estimated_fare: 450,
        ride_status: 'Cancelled',
        payment_status: 'Refunded',
        created_at: new Date('2026-10-20T13:00:00Z').toISOString(),
        updated_at: new Date('2026-10-20T14:05:00Z').toISOString(),
      },
    ],
    payments: [
      {
        id: 'PAY-4011',
        booking_id: 'CB-8921',
        customer_name: 'Priya Sharma',
        amount: 850,
        method: 'UPI',
        status: 'Success',
        transaction_ref: 'UPI-REF-99881234',
        is_demo: true,
        payment_date: new Date('2026-10-22T09:35:00Z').toISOString(),
      },
      {
        id: 'PAY-4010',
        booking_id: 'CB-8920',
        customer_name: 'Sneha Patil',
        amount: 950,
        method: 'Card',
        status: 'Success',
        transaction_ref: 'TXN-CARD-4412098',
        is_demo: true,
        payment_date: new Date('2026-10-21T17:00:00Z').toISOString(),
      },
      {
        id: 'PAY-4009',
        booking_id: 'CB-8919',
        customer_name: 'Vikramaditya Roy',
        amount: 780,
        method: 'UPI',
        status: 'Success',
        transaction_ref: 'UPI-REF-77123991',
        is_demo: true,
        payment_date: new Date('2026-10-21T18:40:00Z').toISOString(),
      },
      {
        id: 'PAY-4008',
        booking_id: 'CB-8918',
        customer_name: 'Pooja Kulkarni',
        amount: 450,
        method: 'NetBanking',
        status: 'Success',
        transaction_ref: 'REF-NETB-129038',
        is_demo: true,
        payment_date: new Date('2026-10-20T14:15:00Z').toISOString(),
      },
    ],
    activity_logs: [
      {
        id: 'log-101',
        user_id: 'usr-001',
        action_type: 'SYSTEM_INIT',
        entity_type: 'SYSTEM',
        entity_id: 'SYS-INIT',
        description: 'CabFlow AI initialized with persistent database storage.',
        metadata: { env: 'college_demo_ready' },
        created_at: new Date('2026-10-22T08:00:00Z').toISOString(),
      },
      {
        id: 'log-102',
        user_id: 'usr-001',
        action_type: 'BOOKING_CREATE',
        entity_type: 'BOOKING',
        entity_id: 'CB-8921',
        description: 'New booking created for Priya Sharma: Pune Airport to JW Marriott.',
        metadata: { fare: 850, vehicle: 'VEH-301' },
        created_at: new Date('2026-10-22T09:00:12Z').toISOString(),
      },
      {
        id: 'log-103',
        user_id: 'usr-001',
        action_type: 'PAYMENT_RECORD',
        entity_type: 'PAYMENT',
        entity_id: 'PAY-4011',
        description: 'Demo payment of ₹850.00 confirmed via UPI for booking CB-8921.',
        metadata: { method: 'UPI', mode: 'demo' },
        created_at: new Date('2026-10-22T09:35:04Z').toISOString(),
      },
      {
        id: 'log-104',
        user_id: 'usr-002',
        action_type: 'BOOKING_UPDATE',
        entity_type: 'BOOKING',
        entity_id: 'CB-8922',
        description: 'Ride status updated to In Progress for Rahul Verma.',
        metadata: { driver: 'DRV-202' },
        created_at: new Date('2026-10-22T10:15:20Z').toISOString(),
      },
    ],
    settings: {
      'usr-001': {
        user_id: 'usr-001',
        language: 'en',
        theme: 'light',
        notifications_enabled: true,
        currency: 'INR',
      },
    },
  };
}

class DatabaseService {
  private pool: mysql.Pool | null = null;
  private isConnectedToMySQL = false;
  private connectionError: string | null = null;
  private data: DatabaseStore;

  constructor() {
    this.data = this.loadLocalStore();
    this.initMySQLConnection();
  }

  private loadLocalStore(): DatabaseStore {
    try {
      if (!fs.existsSync(STORAGE_DIR)) {
        fs.mkdirSync(STORAGE_DIR, { recursive: true });
      }
      if (fs.existsSync(STORAGE_FILE)) {
        const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read existing local store, using default seed:', e);
    }
    const seed = getInitialSeedData();
    this.persistLocalStore(seed);
    return seed;
  }

  private persistLocalStore(store: DatabaseStore) {
    try {
      if (!fs.existsSync(STORAGE_DIR)) {
        fs.mkdirSync(STORAGE_DIR, { recursive: true });
      }
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(store, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist local store:', e);
    }
  }

  private async initMySQLConnection() {
    const host = process.env.DB_HOST;
    const port = Number(process.env.DB_PORT) || 3306;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD || process.env.DB_PASS;
    const database = process.env.DB_NAME || 'cabflow_db';

    if (!host || host.includes('YOUR_AIVEN') || host.includes('aivencloud.com')) {
      // Not configured with valid Aiven host yet, use persistent local store
      this.isConnectedToMySQL = false;
      this.connectionError = host ? 'Aiven credentials are placeholders. Using local persistent database.' : 'DB_HOST not provided. Using local persistent database.';
      return;
    }

    try {
      const sslConfig: any = { rejectUnauthorized: false };
      if (process.env.DB_SSL_CA) {
        if (fs.existsSync(process.env.DB_SSL_CA)) {
          sslConfig.ca = fs.readFileSync(process.env.DB_SSL_CA);
        } else {
          sslConfig.ca = process.env.DB_SSL_CA;
        }
      }

      this.pool = mysql.createPool({
        host,
        port,
        user,
        password,
        database,
        ssl: sslConfig,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      // Test connection
      const conn = await this.pool.getConnection();
      await conn.query('SELECT 1');
      conn.release();
      this.isConnectedToMySQL = true;
      this.connectionError = null;
      console.log('✅ Connected successfully to Aiven Cloud MySQL database!');
    } catch (err: any) {
      this.isConnectedToMySQL = false;
      this.connectionError = err.message || 'MySQL connection failed';
      console.warn('⚠️ Aiven MySQL connection unavailable, falling back to local persistent storage:', this.connectionError);
    }
  }

  public getHealth() {
    return {
      status: 'healthy',
      engine: this.isConnectedToMySQL ? 'Aiven Cloud MySQL' : 'Local Persistent Engine',
      isConnectedToMySQL: this.isConnectedToMySQL,
      connectionError: this.connectionError,
      records: {
        bookings: this.data.bookings.length,
        vehicles: this.data.vehicles.length,
        drivers: this.data.drivers.length,
        customers: this.data.customers.length,
        payments: this.data.payments.length,
        activity_logs: this.data.activity_logs.length,
      },
      dbHost: process.env.DB_HOST ? process.env.DB_HOST.replace(/:.*/, '') : 'None (Local Mode)',
      timestamp: new Date().toISOString(),
    };
  }

  // --- Reset & Seed ---
  public seedDemoData(): { message: string; counts: any } {
    this.data = getInitialSeedData();
    this.persistLocalStore(this.data);
    this.logActivity({
      user_id: 'usr-001',
      action_type: 'DEMO_SEED',
      entity_type: 'SYSTEM',
      entity_id: 'SYS-SEED',
      description: 'Demonstration dataset reloaded with sample bookings, drivers, and vehicles.',
    });
    return {
      message: 'Demo dataset successfully loaded',
      counts: {
        bookings: this.data.bookings.length,
        vehicles: this.data.vehicles.length,
        drivers: this.data.drivers.length,
        customers: this.data.customers.length,
        payments: this.data.payments.length,
      },
    };
  }

  public clearAllData(): { message: string } {
    const adminUser = this.data.users.find((u) => u.role === 'admin') || this.data.users[0];
    this.data = {
      users: [adminUser],
      customers: [],
      drivers: [],
      vehicles: [],
      bookings: [],
      payments: [],
      activity_logs: [],
      settings: {
        [adminUser.id]: {
          user_id: adminUser.id,
          language: 'en',
          theme: 'light',
          notifications_enabled: true,
          currency: 'INR',
        },
      },
    };
    this.persistLocalStore(this.data);
    this.logActivity({
      user_id: adminUser.id,
      action_type: 'SYSTEM_CLEAR',
      entity_type: 'SYSTEM',
      entity_id: 'SYS-CLEAR',
      description: 'Database cleared to empty state for testing.',
    });
    return { message: 'Database emptied for testing' };
  }

  // --- Activity Logging ---
  public logActivity(params: {
    user_id?: string | null;
    action_type: string;
    entity_type: string;
    entity_id?: string | null;
    description: string;
    metadata?: any;
  }) {
    const log: ActivityLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: params.user_id || null,
      action_type: params.action_type,
      entity_type: params.entity_type,
      entity_id: params.entity_id || null,
      description: params.description,
      metadata: params.metadata || null,
      created_at: new Date().toISOString(),
    };
    this.data.activity_logs.unshift(log);
    // Keep last 500 logs
    if (this.data.activity_logs.length > 500) {
      this.data.activity_logs.length = 500;
    }
    this.persistLocalStore(this.data);
    return log;
  }

  public getActivityLogs(filters?: { search?: string; action?: string; limit?: number }) {
    let logs = [...this.data.activity_logs];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.description.toLowerCase().includes(q) ||
          l.action_type.toLowerCase().includes(q) ||
          (l.entity_id && l.entity_id.toLowerCase().includes(q))
      );
    }
    if (filters?.action && filters.action !== 'all') {
      logs = logs.filter((l) => l.action_type === filters.action);
    }
    return logs.slice(0, filters?.limit || 100);
  }

  // --- Users & Auth ---
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(userData: Omit<User, 'id' | 'created_at'>): User {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      ...userData,
      created_at: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.persistLocalStore(this.data);
    return newUser;
  }

  // --- Dashboard Summary ---
  public getDashboardSummary() {
    const totalBookings = this.data.bookings.length;
    const activeRides = this.data.bookings.filter(
      (b) => b.ride_status === 'In Progress' || b.ride_status === 'Confirmed'
    ).length;
    const completedRides = this.data.bookings.filter((b) => b.ride_status === 'Completed').length;
    const cancelledRides = this.data.bookings.filter((b) => b.ride_status === 'Cancelled').length;

    const availableVehicles = this.data.vehicles.filter((v) => v.status === 'available').length;
    const totalVehicles = this.data.vehicles.length;
    const totalDrivers = this.data.drivers.length;
    const totalCustomers = this.data.customers.length;

    // Monthly revenue (completed & paid bookings or successful payments)
    const paidPayments = this.data.payments.filter((p) => p.status === 'Success');
    const totalRevenue = paidPayments.reduce((acc, p) => acc + Number(p.amount), 0);

    const pendingPaymentsCount = this.data.bookings.filter(
      (b) => b.payment_status === 'Pending' && b.ride_status !== 'Cancelled'
    ).length;
    const pendingPaymentsAmount = this.data.bookings
      .filter((b) => b.payment_status === 'Pending' && b.ride_status !== 'Cancelled')
      .reduce((acc, b) => acc + Number(b.estimated_fare), 0);

    // Revenue by last 7 days chart data
    const last7DaysMap: Record<string, { date: string; revenue: number; bookings: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const displayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      last7DaysMap[key] = { date: displayLabel, revenue: 0, bookings: 0 };
    }

    this.data.payments
      .filter((p) => p.status === 'Success')
      .forEach((p) => {
        const key = p.payment_date.split('T')[0];
        if (last7DaysMap[key]) {
          last7DaysMap[key].revenue += Number(p.amount);
        }
      });

    this.data.bookings.forEach((b) => {
      const key = b.booking_time.split('T')[0];
      if (last7DaysMap[key]) {
        last7DaysMap[key].bookings += 1;
      }
    });

    const revenueOverview = Object.values(last7DaysMap);

    // Status breakdown
    const statusCounts = {
      Confirmed: this.data.bookings.filter((b) => b.ride_status === 'Confirmed').length,
      'In Progress': this.data.bookings.filter((b) => b.ride_status === 'In Progress').length,
      Completed: completedRides,
      Pending: this.data.bookings.filter((b) => b.ride_status === 'Pending').length,
      Cancelled: cancelledRides,
    };

    // Vehicle availability by type
    const vehicleByType = {
      Sedan: { total: 0, available: 0 },
      SUV: { total: 0, available: 0 },
      Hatchback: { total: 0, available: 0 },
      Premium: { total: 0, available: 0 },
    };
    this.data.vehicles.forEach((v) => {
      if (vehicleByType[v.type]) {
        vehicleByType[v.type].total += 1;
        if (v.status === 'available') {
          vehicleByType[v.type].available += 1;
        }
      }
    });

    return {
      kpis: {
        totalBookings,
        activeRides,
        availableVehicles,
        totalVehicles,
        totalDrivers,
        totalCustomers,
        totalRevenue,
        pendingPaymentsCount,
        pendingPaymentsAmount,
        completedRides,
        cancelledRides,
      },
      recentBookings: this.data.bookings.slice(0, 6),
      revenueOverview,
      statusCounts,
      vehicleByType,
      latestActivity: this.data.activity_logs.slice(0, 5),
    };
  }

  // --- Bookings ---
  public getBookings(filters?: {
    search?: string;
    ride_status?: string;
    payment_status?: string;
    driver_id?: string;
    vehicle_id?: string;
    date?: string;
  }) {
    let list = [...this.data.bookings];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.customer_name.toLowerCase().includes(q) ||
          b.customer_phone.includes(q) ||
          b.pickup_location.toLowerCase().includes(q) ||
          b.destination.toLowerCase().includes(q)
      );
    }

    if (filters?.ride_status && filters.ride_status !== 'all') {
      list = list.filter((b) => b.ride_status === filters.ride_status);
    }

    if (filters?.payment_status && filters.payment_status !== 'all') {
      list = list.filter((b) => b.payment_status === filters.payment_status);
    }

    if (filters?.driver_id && filters.driver_id !== 'all') {
      list = list.filter((b) => b.driver_id === filters.driver_id);
    }

    if (filters?.vehicle_id && filters.vehicle_id !== 'all') {
      list = list.filter((b) => b.vehicle_id === filters.vehicle_id);
    }

    if (filters?.date) {
      list = list.filter((b) => b.booking_time.startsWith(filters.date!));
    }

    // Sort newest booking first
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  }

  public getBookingById(id: string) {
    return this.data.bookings.find((b) => b.id === id);
  }

  public createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>, actorId?: string) {
    // Generate Booking ID
    const nextNum = 8924 + this.data.bookings.length;
    const id = `CB-${nextNum}`;

    // Conflict validation: Check if vehicle or driver is already on an active trip
    if (bookingData.vehicle_id) {
      const conflictVeh = this.data.bookings.find(
        (b) =>
          b.vehicle_id === bookingData.vehicle_id &&
          (b.ride_status === 'In Progress' || b.ride_status === 'Confirmed')
      );
      if (conflictVeh && (bookingData.ride_status === 'In Progress' || bookingData.ride_status === 'Confirmed')) {
        throw new Error(`Vehicle ${bookingData.vehicle_id} is already assigned to active ride ${conflictVeh.id}.`);
      }
    }

    if (bookingData.driver_id) {
      const conflictDriver = this.data.bookings.find(
        (b) =>
          b.driver_id === bookingData.driver_id &&
          (b.ride_status === 'In Progress' || b.ride_status === 'Confirmed')
      );
      if (conflictDriver && (bookingData.ride_status === 'In Progress' || bookingData.ride_status === 'Confirmed')) {
        throw new Error(`Driver is already assigned to active ride ${conflictDriver.id}.`);
      }
    }

    const now = new Date().toISOString();
    const newBooking: Booking = {
      id,
      ...bookingData,
      created_at: now,
      updated_at: now,
    };

    this.data.bookings.unshift(newBooking);

    // Update vehicle status if In Progress
    if (bookingData.vehicle_id && bookingData.ride_status === 'In Progress') {
      const veh = this.data.vehicles.find((v) => v.id === bookingData.vehicle_id);
      if (veh) veh.status = 'on_trip';
    }
    // Update driver status if In Progress
    if (bookingData.driver_id && bookingData.ride_status === 'In Progress') {
      const drv = this.data.drivers.find((d) => d.id === bookingData.driver_id);
      if (drv) drv.status = 'on_duty';
    }

    // Auto create demo payment if marked as paid
    if (bookingData.payment_status === 'Paid') {
      this.recordPayment({
        booking_id: id,
        customer_name: bookingData.customer_name,
        amount: bookingData.estimated_fare,
        method: 'UPI',
        status: 'Success',
      });
    }

    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'BOOKING_CREATE',
      entity_type: 'BOOKING',
      entity_id: id,
      description: `Booking ${id} created for ${bookingData.customer_name} (${bookingData.pickup_location} → ${bookingData.destination}). Fare: ₹${bookingData.estimated_fare}`,
      metadata: { fare: bookingData.estimated_fare, vehicle: bookingData.vehicle_id },
    });

    return newBooking;
  }

  public updateBooking(id: string, updates: Partial<Booking>, actorId?: string) {
    const idx = this.data.bookings.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error(`Booking ${id} not found`);

    const existing = this.data.bookings[idx];
    const updated: Booking = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // If ride status changes to completed/cancelled, free vehicle and driver
    if (updates.ride_status === 'Completed' || updates.ride_status === 'Cancelled') {
      if (updated.vehicle_id) {
        const v = this.data.vehicles.find((veh) => veh.id === updated.vehicle_id);
        if (v && v.status === 'on_trip') v.status = 'available';
      }
      if (updated.driver_id) {
        const d = this.data.drivers.find((drv) => drv.id === updated.driver_id);
        if (d && d.status === 'on_duty') d.status = 'available';
      }
    } else if (updates.ride_status === 'In Progress') {
      if (updated.vehicle_id) {
        const v = this.data.vehicles.find((veh) => veh.id === updated.vehicle_id);
        if (v) v.status = 'on_trip';
      }
      if (updated.driver_id) {
        const d = this.data.drivers.find((drv) => drv.id === updated.driver_id);
        if (d) d.status = 'on_duty';
      }
    }

    this.data.bookings[idx] = updated;
    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'BOOKING_UPDATE',
      entity_type: 'BOOKING',
      entity_id: id,
      description: `Booking ${id} updated (Ride: ${updated.ride_status}, Payment: ${updated.payment_status})`,
      metadata: updates,
    });

    return updated;
  }

  public cancelBooking(id: string, actorId?: string) {
    return this.updateBooking(id, { ride_status: 'Cancelled' }, actorId);
  }

  public deleteBooking(id: string, actorId?: string) {
    const idx = this.data.bookings.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error(`Booking ${id} not found`);
    const removed = this.data.bookings.splice(idx, 1)[0];
    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'BOOKING_DELETE',
      entity_type: 'BOOKING',
      entity_id: id,
      description: `Booking ${id} deleted by operator.`,
    });

    return removed;
  }

  // --- Vehicles ---
  public getVehicles(filters?: { type?: string; status?: string; search?: string }) {
    let list = [...this.data.vehicles];
    if (filters?.type && filters.type !== 'all') {
      list = list.filter((v) => v.type === filters.type);
    }
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((v) => v.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (v) =>
          v.registration_number.toLowerCase().includes(q) ||
          v.make_model.toLowerCase().includes(q) ||
          v.id.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public createVehicle(vehData: Omit<Vehicle, 'id' | 'created_at'>, actorId?: string) {
    // Check registration duplicate
    const exists = this.data.vehicles.find(
      (v) => v.registration_number.toUpperCase() === vehData.registration_number.toUpperCase()
    );
    if (exists) throw new Error(`Registration ${vehData.registration_number} already exists`);

    const id = `VEH-${300 + this.data.vehicles.length + 1}`;
    const newVehicle: Vehicle = {
      id,
      ...vehData,
      created_at: new Date().toISOString(),
    };
    this.data.vehicles.push(newVehicle);
    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'VEHICLE_ADD',
      entity_type: 'VEHICLE',
      entity_id: id,
      description: `Vehicle ${newVehicle.make_model} (${newVehicle.registration_number}) registered in fleet.`,
    });

    return newVehicle;
  }

  public updateVehicle(id: string, updates: Partial<Vehicle>, actorId?: string) {
    const idx = this.data.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error(`Vehicle ${id} not found`);

    if (updates.registration_number) {
      const dup = this.data.vehicles.find(
        (v) => v.id !== id && v.registration_number.toUpperCase() === updates.registration_number!.toUpperCase()
      );
      if (dup) throw new Error(`Registration number already in use by ${dup.id}`);
    }

    this.data.vehicles[idx] = { ...this.data.vehicles[idx], ...updates };
    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'VEHICLE_UPDATE',
      entity_type: 'VEHICLE',
      entity_id: id,
      description: `Vehicle ${id} updated: Status = ${this.data.vehicles[idx].status}`,
    });

    return this.data.vehicles[idx];
  }

  public deleteVehicle(id: string, actorId?: string) {
    // Check if vehicle has active rides
    const active = this.data.bookings.find(
      (b) => b.vehicle_id === id && (b.ride_status === 'In Progress' || b.ride_status === 'Confirmed')
    );
    if (active) throw new Error(`Cannot delete vehicle ${id} assigned to active ride ${active.id}`);

    const idx = this.data.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) throw new Error(`Vehicle ${id} not found`);
    const removed = this.data.vehicles.splice(idx, 1)[0];
    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'VEHICLE_DELETE',
      entity_type: 'VEHICLE',
      entity_id: id,
      description: `Vehicle ${id} (${removed.registration_number}) removed from fleet.`,
    });

    return removed;
  }

  // --- Drivers ---
  public getDrivers(filters?: { status?: string; search?: string }) {
    let list = [...this.data.drivers];
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((d) => d.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          d.license_number.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public createDriver(driverData: Omit<Driver, 'id' | 'created_at'>, actorId?: string) {
    const dup = this.data.drivers.find(
      (d) => d.license_number.toUpperCase() === driverData.license_number.toUpperCase()
    );
    if (dup) throw new Error(`License number ${driverData.license_number} already registered.`);

    const id = `DRV-${200 + this.data.drivers.length + 1}`;
    const newDriver: Driver = {
      id,
      ...driverData,
      created_at: new Date().toISOString(),
    };
    this.data.drivers.push(newDriver);
    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'DRIVER_ADD',
      entity_type: 'DRIVER',
      entity_id: id,
      description: `Driver ${newDriver.name} registered (License: ${newDriver.license_number}).`,
    });

    return newDriver;
  }

  public updateDriver(id: string, updates: Partial<Driver>, actorId?: string) {
    const idx = this.data.drivers.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error(`Driver ${id} not found`);

    if (updates.license_number) {
      const dup = this.data.drivers.find(
        (d) => d.id !== id && d.license_number.toUpperCase() === updates.license_number!.toUpperCase()
      );
      if (dup) throw new Error(`License number already in use by ${dup.id}`);
    }

    this.data.drivers[idx] = { ...this.data.drivers[idx], ...updates };
    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'DRIVER_UPDATE',
      entity_type: 'DRIVER',
      entity_id: id,
      description: `Driver ${id} (${this.data.drivers[idx].name}) profile updated.`,
    });

    return this.data.drivers[idx];
  }

  public deleteDriver(id: string, actorId?: string) {
    const active = this.data.bookings.find(
      (b) => b.driver_id === id && (b.ride_status === 'In Progress' || b.ride_status === 'Confirmed')
    );
    if (active) throw new Error(`Cannot delete driver ${id} assigned to active ride ${active.id}`);

    const idx = this.data.drivers.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error(`Driver ${id} not found`);
    const removed = this.data.drivers.splice(idx, 1)[0];

    // Unassign from any vehicle
    this.data.vehicles.forEach((v) => {
      if (v.assigned_driver_id === id) v.assigned_driver_id = null;
    });

    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'DRIVER_DELETE',
      entity_type: 'DRIVER',
      entity_id: id,
      description: `Driver ${id} (${removed.name}) removed from roster.`,
    });

    return removed;
  }

  // --- Customers ---
  public getCustomers(filters?: { search?: string }) {
    let list = [...this.data.customers];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }

    // Attach calculated customer statistics from real bookings!
    return list.map((c) => {
      const custBookings = this.data.bookings.filter((b) => b.customer_id === c.id);
      const totalRides = custBookings.length;
      const completedRides = custBookings.filter((b) => b.ride_status === 'Completed').length;
      const totalSpent = custBookings
        .filter((b) => b.ride_status === 'Completed' && b.payment_status === 'Paid')
        .reduce((sum, b) => sum + Number(b.estimated_fare), 0);

      return {
        ...c,
        totalRides,
        completedRides,
        totalSpent,
      };
    });
  }

  public getCustomerById(id: string) {
    const customer = this.data.customers.find((c) => c.id === id);
    if (!customer) return null;
    const history = this.data.bookings.filter((b) => b.customer_id === id);
    return {
      ...customer,
      history,
    };
  }

  public createCustomer(custData: Omit<Customer, 'id' | 'created_at'>, actorId?: string) {
    const id = `CUST-${100 + this.data.customers.length + 1}`;
    const newCust: Customer = {
      id,
      ...custData,
      created_at: new Date().toISOString(),
    };
    this.data.customers.push(newCust);
    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'CUSTOMER_CREATE',
      entity_type: 'CUSTOMER',
      entity_id: id,
      description: `Customer account created for ${newCust.name} (${newCust.phone}).`,
    });

    return newCust;
  }

  public updateCustomer(id: string, updates: Partial<Customer>, actorId?: string) {
    const idx = this.data.customers.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Customer ${id} not found`);

    this.data.customers[idx] = { ...this.data.customers[idx], ...updates };
    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'CUSTOMER_UPDATE',
      entity_type: 'CUSTOMER',
      entity_id: id,
      description: `Customer ${id} details updated.`,
    });

    return this.data.customers[idx];
  }

  public deleteCustomer(id: string, actorId?: string) {
    const active = this.data.bookings.find(
      (b) => b.customer_id === id && (b.ride_status === 'In Progress' || b.ride_status === 'Confirmed')
    );
    if (active) throw new Error(`Cannot delete customer ${id} with active ride ${active.id}`);

    const idx = this.data.customers.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Customer ${id} not found`);
    const removed = this.data.customers.splice(idx, 1)[0];
    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'CUSTOMER_DELETE',
      entity_type: 'CUSTOMER',
      entity_id: id,
      description: `Customer ${id} (${removed.name}) deleted.`,
    });

    return removed;
  }

  // --- Payments ---
  public getPayments(filters?: { status?: string; method?: string; search?: string }) {
    let list = [...this.data.payments];
    if (filters?.status && filters.status !== 'all') {
      list = list.filter((p) => p.status === filters.status);
    }
    if (filters?.method && filters.method !== 'all') {
      list = list.filter((p) => p.method === filters.method);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.booking_id.toLowerCase().includes(q) ||
          p.customer_name.toLowerCase().includes(q) ||
          p.transaction_ref.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
    return list;
  }

  public recordPayment(
    paymentData: {
      booking_id: string;
      customer_name: string;
      amount: number;
      method: 'UPI' | 'Card' | 'Cash' | 'NetBanking';
      status: 'Success' | 'Pending' | 'Failed';
      transaction_ref?: string;
    },
    actorId?: string
  ) {
    const id = `PAY-${4010 + this.data.payments.length + 1}`;
    const payment: Payment = {
      id,
      booking_id: paymentData.booking_id,
      customer_name: paymentData.customer_name,
      amount: paymentData.amount,
      method: paymentData.method,
      status: paymentData.status,
      transaction_ref: paymentData.transaction_ref || `DEMO-REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      is_demo: true,
      payment_date: new Date().toISOString(),
    };

    this.data.payments.unshift(payment);

    // Synchronize booking payment status
    const booking = this.data.bookings.find((b) => b.id === paymentData.booking_id);
    if (booking) {
      booking.payment_status = paymentData.status === 'Success' ? 'Paid' : 'Pending';
      booking.updated_at = new Date().toISOString();
    }

    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId,
      action_type: 'PAYMENT_RECORD',
      entity_type: 'PAYMENT',
      entity_id: id,
      description: `Demo payment of ₹${payment.amount} recorded for ${payment.customer_name} via ${payment.method} (${payment.status}).`,
      metadata: { booking_id: payment.booking_id, amount: payment.amount, method: payment.method },
    });

    return payment;
  }

  // --- Reports & Analytics ---
  public getReportsSummary() {
    // 1. Top Routes
    const routeCounts: Record<string, { route: string; count: number; revenue: number }> = {};
    this.data.bookings.forEach((b) => {
      const key = `${b.pickup_location.split(',')[0]} → ${b.destination.split(',')[0]}`;
      if (!routeCounts[key]) {
        routeCounts[key] = { route: key, count: 0, revenue: 0 };
      }
      routeCounts[key].count += 1;
      if (b.payment_status === 'Paid') {
        routeCounts[key].revenue += Number(b.estimated_fare);
      }
    });

    const topRoutes = Object.values(routeCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 2. Vehicle utilization
    const vehicleUtil = this.data.vehicles.map((v) => {
      const trips = this.data.bookings.filter((b) => b.vehicle_id === v.id && b.ride_status === 'Completed').length;
      return {
        vehicleId: v.id,
        model: v.make_model,
        reg: v.registration_number,
        completedTrips: trips,
        type: v.type,
      };
    });

    // 3. Driver activity
    const driverActivity = this.data.drivers.map((d) => {
      const driverBookings = this.data.bookings.filter((b) => b.driver_id === d.id);
      const completed = driverBookings.filter((b) => b.ride_status === 'Completed').length;
      const earnings = driverBookings
        .filter((b) => b.ride_status === 'Completed' && b.payment_status === 'Paid')
        .reduce((sum, b) => sum + Number(b.estimated_fare), 0);
      return {
        driverId: d.id,
        name: d.name,
        completedRides: completed,
        totalEarnings: earnings,
        status: d.status,
      };
    });

    // 4. Monthly revenue trend
    const monthlyMap: Record<string, number> = {};
    this.data.payments
      .filter((p) => p.status === 'Success')
      .forEach((p) => {
        const month = p.payment_date.substring(0, 7); // YYYY-MM
        monthlyMap[month] = (monthlyMap[month] || 0) + Number(p.amount);
      });

    return {
      topRoutes,
      vehicleUtil,
      driverActivity,
      monthlyMap,
      paymentMethodStats: {
        UPI: this.data.payments.filter((p) => p.method === 'UPI').length,
        Card: this.data.payments.filter((p) => p.method === 'Card').length,
        Cash: this.data.payments.filter((p) => p.method === 'Cash').length,
        NetBanking: this.data.payments.filter((p) => p.method === 'NetBanking').length,
      },
    };
  }

  // --- Settings ---
  public getSettings(userId: string): UserSettings {
    if (!this.data.settings[userId]) {
      this.data.settings[userId] = {
        user_id: userId,
        language: 'en',
        theme: 'light',
        notifications_enabled: true,
        currency: 'INR',
      };
      this.persistLocalStore(this.data);
    }
    return this.data.settings[userId];
  }

  public updateSettings(userId: string, updates: Partial<UserSettings>, actorId?: string): UserSettings {
    const current = this.getSettings(userId);
    const updated: UserSettings = {
      ...current,
      ...updates,
    };
    this.data.settings[userId] = updated;
    this.persistLocalStore(this.data);

    this.logActivity({
      user_id: actorId || userId,
      action_type: 'SETTINGS_UPDATE',
      entity_type: 'SYSTEM',
      entity_id: userId,
      description: `User preferences updated (Language: ${updated.language}, Theme: ${updated.theme}).`,
    });

    return updated;
  }

  // --- Global Search ---
  public globalSearch(query: string) {
    if (!query || query.trim().length === 0) return { bookings: [], customers: [], drivers: [], vehicles: [] };
    const q = query.toLowerCase().trim();

    const matchedBookings = this.data.bookings
      .filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.customer_name.toLowerCase().includes(q) ||
          b.customer_phone.includes(q) ||
          b.pickup_location.toLowerCase().includes(q) ||
          b.destination.toLowerCase().includes(q)
      )
      .slice(0, 5);

    const matchedCustomers = this.data.customers
      .filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q))
      .slice(0, 5);

    const matchedDrivers = this.data.drivers
      .filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          d.license_number.toLowerCase().includes(q)
      )
      .slice(0, 5);

    const matchedVehicles = this.data.vehicles
      .filter((v) => v.registration_number.toLowerCase().includes(q) || v.make_model.toLowerCase().includes(q))
      .slice(0, 5);

    return {
      bookings: matchedBookings,
      customers: matchedCustomers,
      drivers: matchedDrivers,
      vehicles: matchedVehicles,
    };
  }
}

export const db = new DatabaseService();
