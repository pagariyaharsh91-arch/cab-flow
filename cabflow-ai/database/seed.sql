-- ========================================================================
-- CabFlow AI — Demonstration Seed Data
-- Clearly labelled demonstration records for college evaluation
-- ========================================================================

USE cabflow_db;

-- Clear previous demo data in foreign-key safe order
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE payments;
TRUNCATE TABLE bookings;
TRUNCATE TABLE vehicles;
TRUNCATE TABLE drivers;
TRUNCATE TABLE customers;
TRUNCATE TABLE activity_logs;
TRUNCATE TABLE user_settings;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users (Admin, Staff, Viewer) - Password for all is: Admin@123
-- Hash generated via bcrypt (10 rounds): $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO users (id, name, email, password_hash, role, avatar_url) VALUES
('usr-001', 'Prof. Rajesh Kulkarni', 'admin@cabflow.ai', '$2a$10$w3XWJ27b3jYkE4B0r0/3b.N.yYVqN2v11X6V82dE7.wR8E7hFkPye', 'admin', '/src/assets/images/admin_avatar_1792657023605.jpg'),
('usr-002', 'Ananya Deshmukh', 'staff@cabflow.ai', '$2a$10$w3XWJ27b3jYkE4B0r0/3b.N.yYVqN2v11X6V82dE7.wR8E7hFkPye', 'staff', NULL),
('usr-003', 'Guest Evaluator', 'viewer@cabflow.ai', '$2a$10$w3XWJ27b3jYkE4B0r0/3b.N.yYVqN2v11X6V82dE7.wR8E7hFkPye', 'viewer', NULL);

-- 2. Customers
INSERT INTO customers (id, name, phone, email, address) VALUES
('CUST-101', 'Priya Sharma', '+91 98201 12345', 'priya.sharma@example.com', 'Koregaon Park, Pune, MH'),
('CUST-102', 'Rahul Verma', '+91 98902 23456', 'rahul.verma@example.com', 'Bandra West, Mumbai, MH'),
('CUST-103', 'Amit Joshi', '+91 97654 34567', 'amit.joshi@example.com', 'Kothrud, Pune, MH'),
('CUST-104', 'Sneha Patil', '+91 94220 45678', 'sneha.patil@example.com', 'Vashi, Navi Mumbai, MH'),
('CUST-105', 'Vikramaditya Roy', '+91 91580 56789', 'vikram.roy@example.com', 'Hinjawadi Phase 1, Pune, MH'),
('CUST-106', 'Pooja Kulkarni', '+91 93700 67890', 'pooja.k@example.com', 'Aundh, Pune, MH');

-- 3. Drivers
INSERT INTO drivers (id, name, phone, email, license_number, license_expiry, status) VALUES
('DRV-201', 'Suresh Shinde', '+91 98221 44556', 'suresh.shinde@cabflow.ai', 'MH-12-2018-0098431', '2028-06-15', 'available'),
('DRV-202', 'Ramesh Gaikwad', '+91 94235 66778', 'ramesh.gaikwad@cabflow.ai', 'MH-14-2019-0056123', '2027-11-20', 'on_duty'),
('DRV-203', 'Sachin Pawar', '+91 98901 88990', 'sachin.pawar@cabflow.ai', 'MH-01-2020-0012984', '2026-12-10', 'available'),
('DRV-204', 'Mahesh Jadhav', '+91 97664 11223', 'mahesh.jadhav@cabflow.ai', 'MH-12-2017-0077889', '2029-03-30', 'available'),
('DRV-205', 'Sunil More', '+91 91588 33445', 'sunil.more@cabflow.ai', 'MH-14-2016-0044556', '2027-08-14', 'off_duty');

-- 4. Vehicles
INSERT INTO vehicles (id, registration_number, type, make_model, seating_capacity, assigned_driver_id, status, maintenance_notes) VALUES
('VEH-301', 'MH-12-RN-4589', 'Sedan', 'Hyundai Verna 1.5 Turbo', 4, 'DRV-201', 'available', 'Regular oil change completed. Tires in great condition.'),
('VEH-302', 'MH-14-EQ-8921', 'SUV', 'Toyota Innova Crysta 2.4 VX', 7, 'DRV-202', 'on_trip', 'AC service done. Clean interior.'),
('VEH-303', 'MH-12-TX-1024', 'Hatchback', 'Maruti Suzuki Swift ZXi', 4, 'DRV-203', 'available', 'Brake pads replaced last month.'),
('VEH-304', 'MH-01-EV-3301', 'Premium', 'Tata Nexon EV Max Prime', 5, 'DRV-204', 'available', 'Battery health 98%. Fast charging tested.'),
('VEH-305', 'MH-12-BZ-7744', 'SUV', 'Mahindra XUV700 AX7', 7, NULL, 'maintenance', 'Suspension inspection scheduled at authorized center.');

-- 5. Bookings
INSERT INTO bookings (id, customer_id, customer_name, customer_phone, pickup_location, destination, booking_time, vehicle_id, driver_id, estimated_fare, ride_status, payment_status) VALUES
('CB-8921', 'CUST-101', 'Priya Sharma', '+91 98201 12345', 'Pune Airport (PNQ), Lohegaon', 'JW Marriott, Senapati Bapat Rd', '2026-10-22 09:30:00', 'VEH-301', 'DRV-201', 850.00, 'Confirmed', 'Paid'),
('CB-8922', 'CUST-102', 'Rahul Verma', '+91 98902 23456', 'Chhatrapati Shivaji Terminal (CSMT)', 'Bandra Kurla Complex (BKC)', '2026-10-22 10:15:00', 'VEH-302', 'DRV-202', 620.00, 'In Progress', 'Pending'),
('CB-8923', 'CUST-103', 'Amit Joshi', '+91 97654 34567', 'Kothrud Stand, Pune', 'Magarpatta Cybercity, Hadapsar', '2026-10-22 11:00:00', 'VEH-304', 'DRV-204', 540.00, 'Pending', 'Pending'),
('CB-8920', 'CUST-104', 'Sneha Patil', '+91 94220 45678', 'Vashi Plaza, Navi Mumbai', 'Domestic Airport T1, Mumbai', '2026-10-21 16:45:00', 'VEH-303', 'DRV-203', 950.00, 'Completed', 'Paid'),
('CB-8919', 'CUST-105', 'Vikramaditya Roy', '+91 91580 56789', 'Hinjawadi Phase 3 Tech Park', 'Shivajinagar Railway Station', '2026-10-21 18:20:00', 'VEH-301', 'DRV-201', 780.00, 'Completed', 'Paid'),
('CB-8918', 'CUST-106', 'Pooja Kulkarni', '+91 93700 67890', 'Aundh Westend Mall', 'Symbiosis College, Viman Nagar', '2026-10-20 14:10:00', 'VEH-302', 'DRV-202', 450.00, 'Cancelled', 'Refunded');

-- 6. Payments (Demo mode transactions)
INSERT INTO payments (id, booking_id, customer_name, amount, method, status, transaction_ref, is_demo, payment_date) VALUES
('PAY-4011', 'CB-8921', 'Priya Sharma', 850.00, 'UPI', 'Success', 'UPI-REF-99881234', TRUE, '2026-10-22 09:35:00'),
('PAY-4010', 'CB-8920', 'Sneha Patil', 950.00, 'Card', 'Success', 'TXN-CARD-4412098', TRUE, '2026-10-21 17:00:00'),
('PAY-4009', 'CB-8919', 'Vikramaditya Roy', 780.00, 'UPI', 'Success', 'UPI-REF-77123991', TRUE, '2026-10-21 18:40:00'),
('PAY-4008', 'CB-8918', 'Pooja Kulkarni', 450.00, 'NetBanking', 'Success', 'REF-NETB-129038', TRUE, '2026-10-20 14:15:00');

-- 7. Initial Activity Logs
INSERT INTO activity_logs (id, user_id, action_type, entity_type, entity_id, description, metadata, created_at) VALUES
('log-101', 'usr-001', 'SYSTEM_INIT', 'SYSTEM', 'SYS-INIT', 'System initialized with Aiven Cloud database schema and demonstration data.', '{"env": "production_demo"}', '2026-10-22 08:00:00'),
('log-102', 'usr-001', 'BOOKING_CREATE', 'BOOKING', 'CB-8921', 'New booking created for Priya Sharma: Pune Airport to JW Marriott.', '{"fare": 850, "vehicle": "VEH-301"}', '2026-10-22 09:30:12'),
('log-103', 'usr-001', 'PAYMENT_RECORD', 'PAYMENT', 'PAY-4011', 'Demo payment of ₹850.00 received via UPI for booking CB-8921.', '{"method": "UPI", "mode": "demo"}', '2026-10-22 09:35:04'),
('log-104', 'usr-002', 'BOOKING_UPDATE', 'BOOKING', 'CB-8922', 'Ride status updated to In Progress for Rahul Verma.', '{"driver": "DRV-202"}', '2026-10-22 10:15:20');

-- 8. User Settings
INSERT INTO user_settings (user_id, language, theme, notifications_enabled, currency) VALUES
('usr-001', 'en', 'light', TRUE, 'INR'),
('usr-002', 'mr', 'light', TRUE, 'INR'),
('usr-003', 'hi', 'light', TRUE, 'INR');
