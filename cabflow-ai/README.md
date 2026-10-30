# CabFlow AI — Smart Cab Booking & Fleet Management System

> **B.Tech Second Year Web Technologies Project Demonstration**  
> A full-stack, enterprise-grade cab dispatch and fleet management web application with persistent MySQL database support (Aiven Cloud), Web Speech API voice assistant, multilingual interface (English, मराठी, हिन्दी), role-based access control (RBAC), and persistent audit activity logging.

---

## 🚗 Project Overview

**CabFlow AI** provides a complete operations dashboard for fleet supervisors, dispatch operators, and administrators. Built using a decoupled, production-ready full-stack architecture:

1. **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide icons, Recharts data analytics.
2. **Backend:** Node.js, Express.js REST API with structured controllers, role middleware, and audit logging.
3. **Database Architecture:**
   - **Primary:** MySQL 8.0+ hosted on **Aiven Cloud** with SSL/TLS encryption and parameterized queries.
   - **Resilient Fallback:** Built-in persistent relational engine with JSON file-persistence (`/data/cabflow_storage.json`), ensuring offline college lab evaluations work without cloud latency.
4. **Multilingual Architecture:** 100% complete localized dictionaries in **English**, **मराठी (Marathi)**, and **हिन्दी (Hindi)** with zero-reload dynamic switching.
5. **Voice Commands:** Browser **Web Speech API** integration for Indian English (`en-IN`), Marathi (`mr-IN`), and Hindi (`hi-IN`), with text-command input fallback.
6. **Auditing & Compliance:** Persistent server-side activity logs capturing every CRUD mutation, payment reconciliation, and administrative status change.

---

## 📁 Repository Structure

```
cabflow-ai/
├── src/
│   ├── assets/images/       # User avatars and branding assets
│   ├── components/          # Reusable UI components & modals
│   │   ├── AddCustomerModal.tsx
│   │   ├── AddDriverModal.tsx
│   │   ├── AddVehicleModal.tsx
│   │   ├── GlobalSearchModal.tsx
│   │   ├── NewBookingModal.tsx
│   │   ├── RecordPaymentModal.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ToastContainer.tsx
│   │   ├── TopNav.tsx
│   │   └── VoiceCommandModal.tsx
│   ├── context/             # AppContext (Auth, language, toasts, health)
│   ├── hooks/               # useVoiceCommands (Web Speech API parser)
│   ├── i18n/                # Multilingual translations (en, mr, hi)
│   ├── pages/               # Workspace & management page views
│   │   ├── ActivityLogsPage.tsx
│   │   ├── BookingsPage.tsx
│   │   ├── CustomersPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── DriversPage.tsx
│   │   ├── FleetPage.tsx
│   │   ├── PaymentsPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/            # Typed REST API client
│   ├── types/               # TypeScript definitions
│   ├── App.tsx              # Main layout and view routing
│   ├── index.css            # Tailwind & font styling
│   └── main.tsx             # React DOM entry
├── server/
│   └── db.ts                # Dual-engine Database Service (Aiven MySQL + Local)
├── database/
│   ├── schema.sql           # MySQL 8.0+ DDL tables & indexes
│   └── seed.sql             # Demonstration records for college evaluation
├── data/                    # Persistent storage directory
├── server.ts                # Express REST API & Vite middleware entry point
├── .env.example             # Safe environment variable template
├── metadata.json            # AI Studio applet specifications
├── package.json             # NPM dependencies & scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite bundler configuration
```

---

## ⚡ Quick Start & Setup

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- (Optional) **Aiven Cloud MySQL** account for cloud deployment

### 2. Installation
```bash
git clone <repository-url>
cd cabflow-ai
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your environment variables in `.env`:
```env
PORT=3000
JWT_SECRET="cabflow_ai_secure_production_secret_key_2026"

# Optional: Aiven Cloud MySQL connection (leave blank for local persistent engine)
DB_HOST="mysql-service-cabflow.aivencloud.com"
DB_PORT="14520"
DB_NAME="defaultdb"
DB_USER="avnadmin"
DB_PASS="YOUR_AIVEN_PASSWORD"
DB_SSL_CA=""
```

### 4. Running the Full-Stack Application
Start the unified full-stack server (runs Express API routes and Vite frontend on port 3000):
```bash
npm run dev
```
Open **`http://localhost:3000`** in Google Chrome or Microsoft Edge.

---

## 🗄️ Aiven Cloud MySQL Setup Guide

1. Log in to [Aiven Console](https://console.aiven.io/).
2. Create a new **MySQL** service (Developer tier is free/cost-effective).
3. Under **Overview** → **Connection Parameters**, note:
   - Hostname (e.g. `mysql-service-cabflow.aivencloud.com`)
   - Port (e.g. `14520`)
   - User (`avnadmin`)
   - Password
4. Import the schema and seed data into Aiven MySQL:
   ```bash
   mysql -h <HOST> -P <PORT> -u avnadmin -p defaultdb < database/schema.sql
   mysql -h <HOST> -P <PORT> -u avnadmin -p defaultdb < database/seed.sql
   ```
5. Update your `.env` variables and restart `npm run dev`.
6. Visit `Settings` or `http://localhost:3000/api/health` to confirm `engine: "Aiven Cloud MySQL"`.

---

## 🎙️ Voice Assistant Commands (Web Speech API)

Click the **Voice Command** button in the top navigation bar or press the microphone icon. You can speak commands in **English**, **Marathi (मराठी)**, or **Hindi (हिन्दी)**:

| Language | Sample Voice Commands | Action Performed |
| :--- | :--- | :--- |
| **English** | `"Open dashboard"` | Navigates to Overview Dashboard |
| | `"Show all bookings"` | Opens Bookings Management table |
| | `"Create a new booking"` | Opens Booking Modal with confirmation |
| | `"Show available cabs"` | Opens Fleet Management |
| | `"Show pending payments"` | Navigates to Payments |
| | `"Change language to Marathi"` | Switches entire UI to Marathi |
| | `"Change language to Hindi"` | Switches entire UI to Hindi |
| **मराठी** | `"डॅशबोर्ड उघडा"` | डॅशबोर्ड उघडतो |
| | `"सर्व बुकिंग दाखवा"` | सर्व बुकिंग्ज यादी दाखवतो |
| | `"नवीन बुकिंग तयार करा"` | बुकिंग फॉर्म उघडतो |
| | `"उपलब्ध गाड्या दाखवा"` | फ्लीट व्यवस्थापन उघडतो |
| | `"भाषा हिंदी करा"` | भाषा हिंदीमध्ये बदलतो |
| **हिन्दी** | `"डैशबोर्ड खोलो"` | डैशबोर्ड खोलता है |
| | `"सभी बुकिंग दिखाओ"` | बुकिंग्स सूची दिखाता है |
| | `"नई बुकिंग बनाओ"` | बुकिंग फॉर्म खोलता है |
| | `"उपलब्ध गाड़ियाँ दिखाओ"` | गाड़ियाँ फ्लीट दिखाता है |
| | `"भाषा मराठी करो"` | भाषा मराठी में बदलता है |

*Fallback:* If the microphone is unsupported or blocked, a **Text Command Fallback** bar is provided inside the Voice Assistant modal.

---

## 🔐 Authentication & Roles (RBAC)

Use the built-in top-right role switcher or test credentials:
- **Administrator:** `admin@cabflow.ai` / `Admin@123` (Full CRUD across all modules)
- **Staff Operator:** `staff@cabflow.ai` / `Admin@123` (Manage bookings and passengers)
- **Viewer:** `viewer@cabflow.ai` / `Admin@123` (Read-only evaluation mode)

---

## 🧪 Live Evaluation Workflow for Professor

Follow this checklist during the live demonstration:
1. **Explore Dashboard KPIs:** Observe real-time totals for Active Rides, Monthly Revenue (₹), Fleet Availability, and Recent Bookings.
2. **Switch Languages:** Click the language selector in the top bar to switch to **मराठी** and **हिन्दी**. Notice instant localized headers, status badges, buttons, and tables.
3. **Dispatch New Booking:** Click `+ New Booking`, choose a popular preset (e.g. Pune Airport → JW Marriott), assign a vehicle and driver, and click Confirm.
4. **Observe Real-Time Conflict Checks:** Attempting to assign an occupied vehicle displays an assignment conflict alert.
5. **Change Ride Status:** In `Bookings`, toggle ride status from `Confirmed` to `In Progress` to `Completed`.
6. **Record Demo Payment:** Click `Pay ₹850` next to a pending ride, choose UPI, and confirm. Notice the booking updates to `Paid` and monthly revenue updates dynamically.
7. **Test Voice Command:** Speak `"डॅशबोर्ड उघडा"` or `"Show all bookings"`.
8. **Inspect Audit Trail:** Navigate to `Activity Logs` to verify that every action (login, booking creation, status update, payment) was persisted with actor and timestamp.
9. **Export Reports:** Navigate to `Reports & Analytics` and click `Export Report CSV`.

---

## 📄 License
Academic & Educational Project License. Built for B.Tech Web Technologies Curriculum Demonstration.
