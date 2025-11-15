# 🏠 RentWise - Property Management System
<div align="center">
  
![RentWise_Splash](https://github.com/user-attachments/assets/d67a9b06-5cda-48ac-b196-86d0c29e99c2)

---

**_Streamline Your Property Management Journey with RentWise!_**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/) [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/) [![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/) [![Express.js](https://img.shields.io/badge/Express.js-5.1.0-000000?style=for-the-badge&logo=express)](https://expressjs.com/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/) [![Jest](https://img.shields.io/badge/Jest-29.6.1-C21325?style=for-the-badge&logo=jest)](https://jestjs.io/) 

</div>

---

## 📋 Table of Contents

- **[✨ Features](#-features)**  
- **[🏗️ Tech Stack](#️-tech-stack)**  
- **[📱 Screenshots](#-screenshots)**  
- **[🚀 Getting Started](#-getting-started)**  
- **[🔧 Installation](#-installation)**  
- **[🌐 API Endpoints](#-api-endpoints)**  
- **[📊 Dashboard Features](#-dashboard-features)**  
- **[🔒 Security Features](#-security-features)**  
- **[📧 Email System](#-email-system)**  
- **[☁️ Cloud Integration](#️-cloud-integration)**  
- **[⏰ Automated Tasks](#-automated-tasks)**  
- **[🧪 Testing](#-testing)**  
- **[🧪 Code Quality & Analysis](#-code-quality--analysis)**  
- **[�📂 Project Structure](#-project-structure)**  
- **[🔄 CI/CD Pipeline](#-cicd-pipeline)**  
- **[🌐 Deployment](#-deployment)**  
- **[📚 Academic References](#-academic-references)**  
- **[👥 Contributing](#-contributing)**  
- **[📄 License](#-license)**  

---

## ✨ Features

### 🎯 Core Functionality

- **🏘️ Property Management** - Add, edit, and manage multiple properties with detailed information, image uploads, and status tracking.  
- **📋 Lease Management** - Create and track lease agreements with tenants, automated status updates, and contract management.  
- **💰 Invoice Management** - Generate and manage invoices with automated calculations, payment tracking, and financial reporting.  
- **🔧 Maintenance Tracking** - Handle maintenance requests with status tracking, caretaker assignment, and file attachments.  
- **📅 Booking System** - Manage property bookings and reservations with document upload and status management.  
- **📊 Analytics Dashboard** - Visual insights with charts, statistics, revenue trends, and occupancy rates.  
- **👷 Caretaker Management** - Create and manage caretakers, assign maintenance tasks, and track work progress.  
- **⭐ Review System** - Handle tenant reviews and property feedback management.  

### 🎨 User Experience

- **📱 Fully Responsive Design** - Mobile-first approach with seamless desktop experience.  
- **🎭 Smooth Animations** - Framer Motion powered animations for enhanced UX.  
- **🌙 Modern UI/UX** - Clean, intuitive interface with Tailwind CSS and glass-morphism effects.  
- **⚡ Real-time Updates** - Live data updates using React Query with intelligent caching.  
- **🔍 Advanced Search & Filtering** - Quick property and lease filtering capabilities with pagination.  
- **📊 Interactive Charts** - Revenue trends, property distribution, and occupancy analytics with Chart.js.  
- **🔄 Auto-refresh Data** - Smart data refresh mechanisms with loading states and error handling.  

### 🔐 Authentication & Security

- **🛡️ JWT Authentication** - Secure token-based authentication with refresh tokens.  
- **🔒 HTTP-Only Cookies** - Enhanced security with secure cookie storage.  
- **🛡️ Arcjet Protection** - Advanced rate limiting, bot detection, and email validation.  
- **✅ Input Validation** - Comprehensive server-side validation and sanitization.  
- **🧹 Data Sanitization** - Protected against XSS, injection attacks, and malicious inputs.  
- **🔐 CSRF Protection** - Cross-site request forgery protection.  
- **🛡️ Helmet Security** - Security headers including HSTS, CSP, and XSS protection.  
- **🔍 Security Scanning** - Automated vulnerability scanning with ESLint security plugins.  

---

## 🏗️ Tech Stack

<div align="center">

### Frontend  
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react) ![React Router](https://img.shields.io/badge/React_Router-7.9.4-CA4245?style=flat-square&logo=react-router) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=flat-square&logo=tailwind-css) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.24-0055FF?style=flat-square&logo=framer) ![React Query](https://img.shields.io/badge/React_Query-5.90.3-FF4154?style=flat-square&logo=react-query) ![Chart.js](https://img.shields.io/badge/Chart.js-4.5.1-FF6384?style=flat-square&logo=chart.js) ![Axios](https://img.shields.io/badge/Axios-1.12.2-5A29E4?style=flat-square&logo=axios) ![React Icons](https://img.shields.io/badge/React_Icons-5.5.0-E10098?style=flat-square&logo=react) ![Lucide React](https://img.shields.io/badge/Lucide_React-0.545.0-F56565?style=flat-square) ![React Toastify](https://img.shields.io/badge/React_Toastify-11.0.5-FF6B35?style=flat-square)

### Backend  
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js) ![Express.js](https://img.shields.io/badge/Express.js-5.1.0-000000?style=flat-square&logo=express) ![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-47A248?style=flat-square&logo=mongodb) ![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?style=flat-square&logo=json-web-tokens) ![bcrypt](https://img.shields.io/badge/bcrypt-6.0.0-003A70?style=flat-square&logo=letsencrypt) ![Body Parser](https://img.shields.io/badge/Body_Parser-2.2.0-1572B6?style=flat-square) ![Cookie Parser](https://img.shields.io/badge/Cookie_Parser-1.4.7-F7B93E?style=flat-square) ![Validator](https://img.shields.io/badge/Validator-13.15.20-4A90E2?style=flat-square)

### Security & Tools  
![Arcjet](https://img.shields.io/badge/Arcjet-1.0.0_beta-FF6B6B?style=flat-square) ![Helmet](https://img.shields.io/badge/Helmet-8.1.0-000000?style=flat-square) ![Cloudinary](https://img.shields.io/badge/Cloudinary-1.41.3-3448C5?style=flat-square) ![Jest](https://img.shields.io/badge/Jest-29.6.1-C21325?style=flat-square&logo=jest) ![CORS](https://img.shields.io/badge/CORS-2.8.5-C21325?style=flat-square) ![ESLint](https://img.shields.io/badge/ESLint-9.39.1-4B32C3?style=flat-square&logo=eslint) ![Sanitizer](https://img.shields.io/badge/Sanitizer-0.1.3-FF5722?style=flat-square)

### Email & Communication  
![Resend](https://img.shields.io/badge/Resend-6.2.2-000000?style=flat-square) ![Node Cron](https://img.shields.io/badge/Node_Cron-4.2.1-2ECC71?style=flat-square)  

### Development & Quality  
![Nodemon](https://img.shields.io/badge/Nodemon-3.1.10-76D04B?style=flat-square&logo=nodemon) ![SonarQube](https://img.shields.io/badge/SonarQube-Scanner-4E9F3D?style=flat-square&logo=sonarqube) ![Babel](https://img.shields.io/badge/Babel-7.22.15-F9DC3E?style=flat-square&logo=babel) ![Multer](https://img.shields.io/badge/Multer-2.0.2-FF6B35?style=flat-square)

</div>
---

</div>

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (version 18 or higher)  
- **npm** or **yarn**  
- **MongoDB** (local installation or MongoDB Atlas)  
- **Git**

### Environment Variables Required

Create `.env` files in both frontend and backend directories:

**Backend `.env`:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key  
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RESEND_API_KEY=your_resend_api_key
ARCJET_KEY=your_arcjet_key
RESET_PASSWORD_URL=http://localhost:3000/reset-password
```

---

## 🔧 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ST10255814/insy7315-web-api.git
cd insy7315-web-api
```

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run security checks
npm run security:full
```

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```


**🔗 Live Dashboard**: [SonarCloud Quality Gate](https://sonarcloud.io/dashboard?id=insy7315-web-api) - **Current Status: ✅ PASSED**

**📊 Note**: SonarCloud analysis now runs automatically through the **GitHub Actions Security Pipeline**.

### 5️⃣ Access the Application

- **Frontend**: `http://localhost:3000`  
- **Backend API**: `http://localhost:5000`  
- **SonarCloud Dashboard**: [https://sonarcloud.io/dashboard?id=insy7315-web-api](https://sonarcloud.io/dashboard?id=insy7315-web-api)  

---

## 🌐 API Endpoints

<details>
<summary>🔐 Authentication</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/user/register` | Register new user |
| `POST` | `/api/user/login` | User login |
| `POST` | `/api/user/logout` | User logout |
| `POST` | `/api/user/forgot-password` | Reset password request |
| `POST` | `/api/user/reset-password` | Reset password with token |
| `GET` | `/api/user/profile` | Get user profile |

</details>

<details>
<summary>🏘️ Properties</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/listings` | Get all properties for admin |
| `POST` | `/api/listings` | Create new property |
| `PUT` | `/api/listings/:id` | Update property |
| `DELETE` | `/api/listings/:id` | Delete property |
| `GET` | `/api/listings/count` | Get total properties count |
| `GET` | `/api/listings/count/monthly` | Get monthly properties count |
| `GET` | `/api/listings/status` | Get property status distribution |

</details>

<details>
<summary>📋 Leases</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leases` | Get all leases for admin |
| `POST` | `/api/leases` | Create new lease |
| `PUT` | `/api/leases/:id` | Update lease |
| `DELETE` | `/api/leases/:id` | Delete lease |
| `GET` | `/api/leases/count` | Get active leases count |
| `GET` | `/api/leases/percentage` | Get leased percentage |

</details>

<details>
<summary>💰 Invoices</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/invoices` | Get all invoices for admin |
| `POST` | `/api/invoices` | Create new invoice |
| `PUT` | `/api/invoices/:id` | Update invoice |
| `DELETE` | `/api/invoices/:id` | Delete invoice |
| `PATCH` | `/api/invoices/pay/:id` | Mark invoice as paid |
| `GET` | `/api/invoices/stats` | Get invoice statistics |

</details>

<details>
<summary>🔧 Maintenance</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/maintenance` | Get all maintenance requests |
| `POST` | `/api/maintenance/create/caretaker` | Create new caretaker |
| `GET` | `/api/maintenance/caretakers` | Get all caretakers |
| `POST` | `/api/maintenance/assign` | Assign caretaker to request |
| `PATCH` | `/api/maintenance/update` | Update maintenance request |
| `PATCH` | `/api/maintenance/complete` | Mark request as completed |
| `GET` | `/api/maintenance/count` | Get maintenance requests count |
| `GET` | `/api/maintenance/count/high-priority` | Get high priority count |
| `DELETE` | `/api/maintenance/caretaker/:id` | Delete caretaker |

</details>

<details>
<summary>📅 Bookings</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bookings` | Get all bookings for admin |
| `GET` | `/api/bookings/:id` | Get booking by ID |
| `DELETE` | `/api/bookings/:id` | Delete booking |
| `GET` | `/api/bookings/revenue/current` | Get current month revenue |

</details>

<details>
<summary>📊 Revenue & Analytics</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/revenue/monthly` | Get monthly revenue |
| `GET` | `/api/revenue/trend` | Get revenue trend (12 months) |
| `GET` | `/api/activity` | Get recent activity feed |

</details>

<details>
<summary>⭐ Reviews</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reviews` | Get all reviews for admin |
| `POST` | `/api/reviews` | Create new review |
| `DELETE` | `/api/reviews/:id` | Delete review |

</details>

---

## 📊 Dashboard Features

### 🎯 Overview Tab

- **📈 Key Metrics** - Total properties, monthly revenue, active leases, pending maintenance tasks.  
- **📊 Interactive Charts** - Revenue trends (Line chart), property distribution (Pie chart).  
- **🔔 Recent Activity Feed** - Latest transactions, updates, and system activities.  
- **⚡ Auto-refresh** - Smart data refresh with loading states and error handling.  
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile views.  

### 🏘️ Properties Management

- **🏠 Property Cards** - Visual property cards with images, status, and actions.  
- **� Image Upload** - Cloudinary integration for property images.  
- **🔍 Search & Filter** - Advanced filtering by status, price, location.  
- **📊 Status Tracking** - Available, occupied, under maintenance states.  

### 📋 Lease Management

- **📄 Lease Creation** - Comprehensive lease agreement forms.  
- **📅 Date Management** - Start/end dates with automated status updates.  
- **💰 Rent Tracking** - Monthly rent amounts and payment tracking.  
- **🔄 Status Updates** - Active, expired, terminated lease states.  

### 💰 Invoice Management

- **🧾 Invoice Generation** - Automated invoice creation with calculations.  
- **💳 Payment Tracking** - Mark invoices as paid/unpaid.  
- **📊 Financial Statistics** - Revenue analytics and payment trends.  
- **📧 Email Integration** - Automated invoice notifications.  

### 🔧 Maintenance System

- **🛠️ Request Management** - Create and track maintenance requests.  
- **👷 Caretaker Assignment** - Assign qualified caretakers to tasks.  
- **📷 Image Uploads** - Document issues with photo attachments.  
- **⚠️ Priority Levels** - High, medium, low priority classification.  
- **✅ Completion Tracking** - Mark requests as completed with updates.  

### 📅 Booking System

- **🏨 Reservation Management** - Handle property bookings and reservations.  
- **📎 Document Upload** - Support documents with Cloudinary storage.  
- **💰 Revenue Calculation** - Automated booking revenue tracking.  
- **📊 Status Management** - Confirmed, pending, cancelled states.  

### ⭐ Review System

- **📝 Review Management** - Handle tenant reviews and feedback.  
- **⭐ Rating System** - Star-based property ratings.  
- **🔍 Review Filtering** - Filter by rating, date, property.  

### 👷 Caretaker Management

- **👤 Caretaker Profiles** - Manage caretaker information and skills.  
- **📞 Contact Management** - Phone, email, and professional details.  
- **🔧 Task Assignment** - Assign maintenance tasks to qualified staff.  
- **📊 Work Tracking** - Monitor caretaker performance and availability.  

---

## � Security Features

### 🛡️ Multi-Layer Security

- **🔐 JWT Authentication** - Secure token-based authentication with refresh tokens.  
- **🍪 HTTP-Only Cookies** - Secure cookie storage preventing XSS attacks.  
- **🛡️ Arcjet Protection** - Advanced bot detection, rate limiting, and email validation.  
- **🔒 Input Validation** - Comprehensive server-side validation using custom validators.  
- **🧹 Data Sanitization** - XSS and injection attack prevention with sanitization.  
- **🛡️ CSRF Protection** - Cross-site request forgery protection mechanisms.  
- **🔐 Password Security** - bcrypt hashing with salt rounds for secure password storage.  
- **📧 Email Security** - Disposable email detection and MX record validation.  

### 🔍 Security Headers

- **⛑️ Helmet.js** - Comprehensive security headers including HSTS, CSP, X-Frame-Options.  
- **🌐 CORS Configuration** - Secure cross-origin resource sharing policies.  
- **🔒 Content Security Policy** - Prevents code injection and XSS attacks.  
- **🛡️ Security Scanning** - Automated vulnerability scanning with ESLint security plugins.  

---

## 📧 Email System

### 📬 Resend Integration

- **📤 Transactional Emails** - Password reset, notifications, and system alerts.  
- **🎨 HTML Templates** - Beautiful, responsive email templates with branding.  
- **🔐 Secure Templates** - XSS-safe email content with input sanitization.  
- **📊 Email Analytics** - Track email delivery and engagement metrics.  

### 📧 Email Features

- **🔑 Password Reset** - Secure password reset emails with time-limited tokens.
- **🔗 Dynamic Links** - Contextual links with proper URL sanitization.  
- **📱 Mobile Optimized** - Responsive email design for all devices.  

---

## ☁️ Cloud Integration

### 📸 Cloudinary Integration

- **🖼️ Image Management** - Property images, maintenance photos, profile pictures.  
- **📁 File Storage** - Secure document storage for booking attachments.  
- **🔄 Dynamic Storage** - Automatic file type detection (images vs documents).  
- **⚡ Optimized Delivery** - CDN-powered fast image delivery with transformations.  
- **📊 Storage Analytics** - Monitor storage usage and file organization.  

### 📁 File Upload Features

- **📸 Property Images** - High-quality property photo uploads with resizing.  
- **📄 Document Support** - PDF, DOCX support for booking documents.  
- **🔧 Maintenance Photos** - Visual documentation of maintenance issues.  
- **👤 Profile Pictures** - User avatar uploads with optimization.  
- **🔒 Secure Upload** - File type validation and size restrictions.  

---

## ⏰ Automated Tasks

### 🔄 Scheduled Operations

- **📅 Status Updates** - Automated lease and booking status management.  
- **💰 Revenue Calculation** - Monthly revenue aggregation and historical data.  
- **🧹 Data Cleanup** - Removal of zero-revenue records and data optimization.  
- **📊 Statistics Generation** - Automated dashboard metrics calculation.  

### ⏲️ Cron Job Schedule

- **🕐 Hourly Tasks** - Status updates for leases, invoices, and bookings.  
- **🌅 Daily Tasks** - Revenue calculations and data aggregation.  
- **📅 Weekly Tasks** - System maintenance and cleanup operations.  
- **📊 Monthly Tasks** - Historical revenue calculation and reporting.  

---

## 🧪 Testing

### 📊 Test Coverage

**Current Coverage: ~31% (Backend)**
- **Statements**: 30%+  
- **Branches**: 25%+  
- **Functions**: 24%+  
- **Lines**: 30%+  

### 🧪 Testing Framework

- **⚡ Jest** - Unit testing framework with comprehensive test suites.  
- **🔍 Service Layer Testing** - All major services have dedicated test files.  
- **📊 Coverage Reports** - HTML and LCOV coverage reports generation.  
- **🔄 Automated Testing** - CI/CD integration with automated test runs.  

### 📁 Test Structure

```
backend/tests/
├── activityService.test.js      # Activity feed testing
├── bookingService.test.js       # Booking system testing  
├── invoiceService.test.js       # Invoice management testing
├── leaseService.test.js         # Lease management testing
├── listingService.test.js       # Property listing testing
├── maintenanceService.test.js   # Maintenance system testing
├── revenueService.test.js       # Revenue calculation testing
├── userService.test.js          # User authentication testing
├── ServiceTestBase.js           # Base test utilities
├── setup.js                     # Test environment setup
└── testUtils.js                 # Testing helper functions
```

### 🚀 Running Tests

```bash
# Backend tests
cd backend
npm test                    # Run all tests
npm run test:coverage      # Run with coverage report

# Frontend tests  
cd frontend
npm test                    # Run React tests
npm run test:coverage      # Run with coverage report
```

---

## 📈 Code Quality & Analysis

### 🎯 SonarQube Integration

- **📊 Quality Gate** - Automated code quality validation.  
- **🔍 Code Analysis** - Comprehensive static code analysis.  
- **🐛 Bug Detection** - Automated bug and vulnerability detection.  
- **📈 Technical Debt** - Code maintainability and technical debt tracking.  
- **🔒 Security Hotspots** - Security vulnerability identification.  

### 📊 Quality Metrics

- **📈 Maintainability Rating**: A  
- **🔒 Security Rating**: A  
- **🐛 Reliability Rating**: A  
- **📊 Code Coverage**: 31%+  
- **🔄 Duplication**: <3%  

### 🔗 SonarCloud Dashboard

**Project URL**: [https://sonarcloud.io/dashboard?id=insy7315-web-api](https://sonarcloud.io/dashboard?id=insy7315-web-api)  
   
[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=ST10255814_insy7315-web-api)](https://sonarcloud.io/summary/new_code?id=ST10255814_insy7315-web-api)

### 🛠️ Code Quality Tools

- **🔍 ESLint** - JavaScript linting with security rules.  
- **🛡️ Security Plugins** - Automated security vulnerability scanning.  
- **📊 Jest Coverage** - Test coverage analysis and reporting.  
- **🔄 GitHub Actions** - Automated quality checks on every commit.  

---

## 📂 Project Structure

```
insy7315-web-api/
├── 📁 backend/                    # Node.js/Express backend
│   ├── 📁 src/
│   │   ├── 📁 Controllers/        # Route controllers
│   │   │   ├── activityController.js
│   │   │   ├── bookingController.js
│   │   │   ├── invoiceController.js
│   │   │   ├── leaseController.js
│   │   │   ├── listingController.js
│   │   │   ├── maintenanceController.js
│   │   │   ├── revenueController.js
│   │   │   ├── reviewController.js
│   │   │   └── userController.js
│   │   ├── 📁 Services/           # Business logic layer
│   │   │   ├── bookingService.js
│   │   │   ├── invoiceService.js
│   │   │   ├── leaseService.js
│   │   │   ├── listingService.js
│   │   │   ├── maintenanceService.js
│   │   │   ├── revenueService.js
│   │   │   └── userService.js
│   │   ├── 📁 routes/             # API route definitions
│   │   ├── 📁 middleware/         # Custom middleware
│   │   │   ├── arcjet.middleware.js
│   │   │   └── checkAuth.js
│   │   ├── 📁 utils/              # Utility functions
│   │   │   ├── db.js
│   │   │   ├── validation.js
│   │   │   ├── cloudinary.js
│   │   │   └── idGenerator.js
│   │   ├── 📁 emails/             # Email system
│   │   │   ├── emailHandler.js
│   │   │   └── 📁 templates/
│   │   ├── 📁 Schedule_Updates/   # Automated tasks
│   │   │   └── scheduledTasks.js
│   │   ├── 📁 config/             # Configuration files
│   │   └── server.js              # Express server entry
│   ├── 📁 tests/                  # Test files
│   ├── 📁 coverage/               # Coverage reports
│   ├── package.json
│   ├── jest.config.json
│   └── eslint.config.js
├── 📁 frontend/                   # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/         # React components
│   │   │   ├── 📁 common/         # Reusable components
│   │   │   ├── 📁 dashboard/      # Dashboard components
│   │   │   ├── 📁 feature/        # Feature-specific components
│   │   │   ├── 📁 layout/         # Layout components
│   │   │   └── 📁 modals/         # Modal components  
│   │   ├── 📁 pages/              # Page components
│   │   ├── 📁 services/           # API service layers
│   │   ├── 📁 utils/              # Utility functions
│   │   ├── 📁 hooks/              # Custom React hooks
│   │   ├── 📁 constants/          # Application constants
│   │   └── 📁 lib/                # Third-party integrations
│   ├── 📁 public/                 # Static assets
│   ├── 📁 build/                  # Production build
│   ├── package.json
│   └── tailwind.config.js
├── 📁 scripts/                    # Utility scripts
│   └── security-check.sh
├── 📄 README.md                   # Project documentation
├── 📄 SECURITY.md                 # Security documentation
├── 📄 SONARQUBE_SETUP.md          # SonarQube setup guide
├── 📄 sonar-project.properties    # SonarQube configuration
└── 📄 .github/workflows/          # CI/CD workflows
```

---

## 🔄 CI/CD Pipeline

### 🚀 Comprehensive Security Pipeline

- **🔍 SonarCloud Integration** - Automated code quality analysis and quality gates.  
- **🧪 Automated Testing** - Jest test suite execution with coverage reporting.  
- **🔒 Multi-Layer Security** - Snyk, Trivy, OWASP vulnerability scanning.  
- **🕷️ Penetration Testing** - OWASP ZAP, injection testing, auth bypass testing.  
- **📊 Quality Gates** - Automated quality and security validation before merge.  

### 🔄 Workflow Triggers

- **📝 Push to Main** - Full security and quality pipeline execution.  
- **🔀 Pull Requests** - Comprehensive security and quality checks.  
- **📅 Scheduled Scans** - Weekly automated security and quality assessments.  
- **🚀 Manual Dispatch** - On-demand pipeline execution with full reporting.  

### 📊 Enhanced Pipeline Stages

1. **�️ Security Foundation** - Secret detection, crypto analysis, environment security  
2. **📦 Dependency Security** - Vulnerability scanning, license compliance, tree analysis  
3. **� Advanced Vulnerability Scanning** - Snyk (production), Trivy, OWASP Dependency-Check  
4. **🕷️ Penetration Testing** - OWASP ZAP, SQL/NoSQL injection, XSS, CSRF testing  
5. **� Code Security Analysis** - Static analysis, security linting, OWASP Top 10  
6. **🏗️ Infrastructure Security** - Configuration security, network policies, SSL/TLS  
7. **⚡ Runtime Security** - Authentication testing, API security, JWT validation  
8. **� SonarCloud Analysis** - Code quality, coverage analysis, maintainability scoring  
9. **📈 Security Compliance** - Comprehensive reporting, compliance validation  

---

## 🌐 Deployment

### 🚀 Production Environment

- **🌐 Frontend**: Deployed on Render 
- **⚚ Backend**: Node.js server on Render with auto-scaling  
- **🗄️ Database**: MongoDB Atlas with replica sets  
- **☁️ File Storage**: Cloudinary CDN for images and documents  
- **📧 Email Service**: Resend for transactional emails  

### 🔧 Environment Configuration

- **🔒 Environment Variables** - Secure configuration management  
- **🌐 CORS Configuration** - Production domain whitelisting  
- **🔐 SSL/TLS** - HTTPS enforcement with security headers  
- **📊 Monitoring** - Application performance and error tracking  

---

## 📚 Academic References

### 📖 Research Sources

This section is reserved for academic sources and references that were consulted during the development of this project. 

### 🔗 Technical Documentation References

**Frontend Libraries and Frameworks:**

Arcjet. 2024. *Arcjet Documentation - Security as Code*. Arcjet. [online] Available at: <https://docs.arcjet.com/> [Accessed: 14 October 2025].

Chart.js. 2024. *React Chart.js 2 Documentation*. Chart.js. [online] Available at: <https://react-chartjs-2.js.org/> [Accessed: 23 Ocotber 2025].

Cloudinary. 2024. *Node.js Integration Guide*. Cloudinary. [online] Available at: <https://cloudinary.com/documentation/node_integration#landingpage> [Accessed: 20 October 2025].

React Dev. 2024. *React Documentation - Lazy Loading*. React Dev. [online] Available at: <https://react.dev/reference/react/lazy> [Accessed: 12 November 2025].

Fkhadra. 2024. *React Toastify Documentation*. GitHub. [online] Available at: <https://fkhadra.github.io/react-toastify/introduction/> [Accessed: 15 October 2025].

FontAwesome. 2024. *Using Font Awesome with React*. FontAwesome. [online] Available at: <https://docs.fontawesome.com/web/use-with/react> [Accessed: 14 October 2025].

Motion Dev. 2024. *Motion Documentation - Quick Start Guide*. Motion. [online] Available at: <https://motion.dev/docs/quick-start> [Accessed: 14 Ocotber 2025].

TailwindLabs. 2024. *Tailwind CSS - Create React App Guide*. TailwindCSS. [online] Available at: <https://v3.tailwindcss.com/docs/guides/create-react-app> [Accessed: 13 October 2025].

TanStack. 2024. *TanStack Query Documentation - React Overview*. TanStack. [online] Available at: <https://tanstack.com/query/v5/docs/framework/react/overview> [Accessed: 16 October 2025].

**Backend and Security:**

Axios. 2024. *Axios HTTP Client - Interceptors Documentation*. Axios. [online] Available at: <https://axios-http.com/docs/interceptors> [Accessed: 14 October 2025].

NPM. 2024. *CORS Middleware for Express*. NPM. [online] Available at: <https://www.npmjs.com/package/cors> [Accessed: 14 October 2025].

NPM. 2024. *HTTP Strict Transport Security (HSTS)*. NPM. [online] Available at: <https://www.npmjs.com/package/hsts> [Accessed: 10 November 2025].

Resend. 2024. *API Keys Documentation*. Resend. [online] Available at: <https://resend.com/docs/dashboard/api-keys/introduction> [Accessed: 14 October 2025].

GeeksForGeeks. 2019. HTTP Cookies in Node.js. GeeksForGeeks. [online] Available at: <https://www.geeksforgeeks.org/node-js/http-cookies-in-node-js/> [Accessed: 14 October 2025].

Snyk. 2024. *How to Protect Node.js Apps from CSRF Attacks*. Snyk. [online] Available at: <https://snyk.io/blog/how-to-protect-node-js-apps-from-csrf-attacks/> [Accessed: 10 November 2025].

Gupta. C. 2025. Implement Cron-job (React, Node). Medium. [blog] 16 March. Available at: <https://medium.com/@mynameischandangupta1/implement-cron-job-react-node-e246536f1267> [Accessed: 17 October 2025].

**Development Tools and CI/CD:**

GitHub. 2024. *GitHub Copilot Documentation*. GitHub. [online] Available at: <https://docs.github.com/en/copilot> [Accessed: 12 November 2025].

SonarCloud. 2024. *GitHub Actions Integration Configuration*. SonarCloud. [online] Available at: <https://sonarcloud.io/project/configuration/GitHubActions?id=ST10255814_insy7315-web-api> [Accessed: 12 November 2025].

Snyk Ltd. 2024. *Getting Started with Snyk Vulnerability Scanning*. Snyk. [online] Available at: <https://docs.snyk.io/discover-snyk/getting-started> [Accessed: 12 November 2025].

**Video Tutorials:**

Cosden Solutions. 2024. *React Frontend Development Tutorials*. Cosden Solutions. [video online] Available at: <https://youtube.com/@cosdensolutions?si=2pjEWhA-Jknf3cB3> [Accessed: 15 October 2025]. (This is a link to the channel I followed for all reacts best practices). 

Dipesh Malvia. 2024. *Node.js Cron Jobs Tutorial*. Dipesh Malvia. [video online] Available at: <https://youtu.be/6gmdFPlkuhQ?si=BgBLupsrlxMhu2S1> [Accessed: 17 October 2025].

CodeWithAamir. 2023. *File Downloads in React Tutorial*. CodeWithAamir. [video online] Available at: <https://youtu.be/IPEqb_AJbAQ?si=DqmAUNa9CiJrLoV-> [Accessed: 22 October 2025].

Cloudinary. 2024. *Drag and Drop File Uploads Tutorial*. Cloudinary. [video online] Available at: <https://youtu.be/8VHVWPkWR8Q?si=o2QDJFpwDKUFhh4J> [Accessed: 27 October 2025].

**Testing**  
JestJS. 2025. Getting Started. JestJS. [online] Available at: <https://jestjs.io/docs/getting-started> [Accessed 28 October 2025]. 

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

### 📋 License Summary

- **✅ Commercial Use** - Use commercially  
- **✅ Modification** - Modify the source code  
- **✅ Distribution** - Distribute the software  
- **✅ Private Use** - Use privately  
- **❌ Liability** - No liability guarantee  
- **❌ Warranty** - No warranty provided  

---
