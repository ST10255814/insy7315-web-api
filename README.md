# 🏠 RentWise - Property Management System

<div align="center">

![RentWise Logo](https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80)

### *Streamline Your Property Management Journey*

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [📱 Screenshots](#-screenshots)
- [🚀 Getting Started](#-getting-started)
- [🔧 Installation](#-installation)
- [🌐 API Endpoints](#-api-endpoints)
- [📊 Dashboard Features](#-dashboard-features)
- [🔒 Security Features](#-security-features)
- [🧪 Testing](#-testing)
- [📂 Project Structure](#-project-structure)
- [👥 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🎯 Core Functionality
- **🏘️ Property Management** - Add, edit, and manage multiple properties with detailed information
- **📋 Lease Management** - Create and track lease agreements with tenants
- **💰 Invoice Management** - Generate and manage invoices with automated calculations
- **🔧 Maintenance Tracking** - Handle maintenance requests with status tracking and file attachments
- **📅 Booking System** - Manage property bookings and reservations
- **📊 Analytics Dashboard** - Visual insights with charts and statistics

### 🎨 User Experience
- **📱 Fully Responsive Design** - Mobile-first approach with seamless desktop experience
- **🎭 Smooth Animations** - Framer Motion powered animations for enhanced UX
- **🌙 Modern UI/UX** - Clean, intuitive interface with Tailwind CSS
- **⚡ Real-time Updates** - Live data updates using React Query
- **🔍 Advanced Search & Filtering** - Quick property and lease filtering capabilities

### 🔐 Authentication & Security
- **🛡️ JWT Authentication** - Secure token-based authentication
- **🔒 HTTP-Only Cookies** - Enhanced security with secure cookie storage
- **🛡️ Arcjet Protection** - Advanced rate limiting and attack protection
- **✅ Input Validation** - Comprehensive server-side validation
- **🧹 Data Sanitization** - Protected against XSS and injection attacks

---

## 🏗️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![React Router](https://img.shields.io/badge/React_Router-7.9.4-CA4245?style=flat-square&logo=react-router)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.24-0055FF?style=flat-square&logo=framer)
![React Query](https://img.shields.io/badge/React_Query-5.90.3-FF4154?style=flat-square&logo=react-query)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5.1-FF6384?style=flat-square&logo=chart.js)
![Axios](https://img.shields.io/badge/Axios-1.12.2-5A29E4?style=flat-square&logo=axios)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-5.1.0-000000?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-47A248?style=flat-square&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-9.0.2-000000?style=flat-square&logo=json-web-tokens)
![bcrypt](https://img.shields.io/badge/bcrypt-6.0.0-003A70?style=flat-square&logo=letsencrypt)

### Security & Tools
![Arcjet](https://img.shields.io/badge/Arcjet-1.0.0_beta-FF6B6B?style=flat-square)
![Helmet](https://img.shields.io/badge/Helmet-8.1.0-000000?style=flat-square)
![Cloudinary](https://img.shields.io/badge/Cloudinary-1.41.3-3448C5?style=flat-square)
![Jest](https://img.shields.io/badge/Jest-29.6.1-C21325?style=flat-square&logo=jest)

</div>

---

## 📱 Screenshots

<div align="center">

### 🏠 Landing Page
![Landing Page](https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80)

### 📊 Dashboard Overview
![Dashboard](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80)

### 🏘️ Property Management
![Properties](https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80)

### 🔧 Maintenance Tracking
![Maintenance](https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80)

</div>

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

---

## 🔧 Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/rentwise-property-management.git
cd rentwise-property-management
```

### 2️⃣ Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm start
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
```

### 4️⃣ Access the Application
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

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

</details>

<details>
<summary>🏘️ Properties</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/listings` | Get all properties |
| `POST` | `/api/listings` | Create new property |
| `PUT` | `/api/listings/:id` | Update property |
| `DELETE` | `/api/listings/:id` | Delete property |

</details>

<details>
<summary>📋 Leases</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leases` | Get all leases |
| `POST` | `/api/leases` | Create new lease |
| `PUT` | `/api/leases/:id` | Update lease |
| `DELETE` | `/api/leases/:id` | Delete lease |

</details>

<details>
<summary>💰 Invoices</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/invoices` | Get all invoices |
| `POST` | `/api/invoices` | Create new invoice |
| `PUT` | `/api/invoices/:id` | Update invoice |
| `DELETE` | `/api/invoices/:id` | Delete invoice |

</details>

<details>
<summary>🔧 Maintenance</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/maintenance` | Get maintenance requests |
| `POST` | `/api/maintenance` | Create maintenance request |
| `PUT` | `/api/maintenance/:id` | Update maintenance status |

</details>

<details>
<summary>📅 Bookings</summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bookings` | Get all bookings |
| `POST` | `/api/bookings` | Create new booking |
| `PUT` | `/api/bookings/:id` | Update booking |
| `DELETE` | `/api/bookings/:id` | Cancel booking |

</details>

---

## 📊 Dashboard Features

### 🎯 Overview Tab
- **📈 Key Metrics** - Total properties, active leases, revenue
- **📊 Interactive Charts** - Revenue trends, occupancy rates
- **🔔 Recent Activity** - Latest transactions and updates
- **⚡ Quick Actions** - Fast access to common tasks

### 🏘️ Properties Tab
- **➕ Add Properties** - Comprehensive property creation form
- **🔍 Search & Filter** - Advanced filtering by location, type, status
- **✏️ Edit Properties** - In-line editing capabilities
- **📷 Image Management** - Cloudinary-powered image uploads

### 📋 Leases Tab
- **📝 Lease Creation** - Digital lease agreement generation
- **📅 Date Management** - Start/end dates with automated calculations
- **💰 Rent Tracking** - Monthly rent amounts and payment status
- **👥 Tenant Information** - Complete tenant profiles

### 💰 Invoices Tab
- **🧾 Invoice Generation** - Automated invoice creation
- **💳 Payment Tracking** - Status monitoring (Paid/Pending/Overdue)
- **📊 Financial Reports** - Revenue analytics and summaries
- **📄 PDF Export** - Professional invoice generation

### 🔧 Maintenance Tab
- **📋 Request Management** - Kanban-style maintenance board
- **📎 File Attachments** - Document and image uploads
- **🏷️ Priority Levels** - High, Medium, Low priority classification
- **👷 Caretaker Assignment** - Task delegation system

### 📅 Bookings Tab
- **📅 Calendar View** - Visual booking management
- **🏠 Property Availability** - Real-time availability checking
- **💰 Pricing Management** - Dynamic pricing controls
- **✅ Booking Confirmation** - Automated confirmation system

---

## 🔒 Security Features

### 🛡️ Authentication Security
- **🔐 JWT Tokens** - Secure token-based authentication
- **🍪 HTTP-Only Cookies** - Enhanced cookie security
- **⏰ Token Expiration** - Automatic session management
- **🔄 Refresh Tokens** - Seamless session renewal

### 🛡️ Data Protection
- **🧹 Input Sanitization** - XSS prevention
- **✅ Data Validation** - Comprehensive server-side validation
- **🔐 Password Hashing** - bcrypt encryption
- **🛡️ CORS Protection** - Cross-origin request security

### 🛡️ Advanced Security
- **🚦 Rate Limiting** - Arcjet-powered request throttling
- **🛡️ Attack Prevention** - SQL injection and XSS protection
- **🔒 Helmet.js** - Security headers configuration
- **📊 Security Monitoring** - Real-time threat detection

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test files
npm test userService.test.js
npm test invoiceService.test.js
```

### Test Coverage

Our test suite covers:
- **🔐 User Authentication** - Registration, login, password reset
- **🏘️ Property Management** - CRUD operations and validations
- **📋 Lease Operations** - Lease creation and management
- **💰 Invoice Processing** - Invoice generation and calculations
- **🔧 Maintenance System** - Request handling and status updates

---

## 📂 Project Structure

```
rentwise-property-management/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 Controllers/          # Request handlers
│   │   │   ├── userController.js
│   │   │   ├── leaseController.js
│   │   │   ├── invoiceController.js
│   │   │   ├── listingController.js
│   │   │   ├── bookingController.js
│   │   │   └── maintenanceController.js
│   │   ├── 📁 Services/             # Business logic
│   │   │   ├── userService.js
│   │   │   ├── leaseService.js
│   │   │   ├── invoiceService.js
│   │   │   ├── listingService.js
│   │   │   ├── bookingService.js
│   │   │   └── maintenanceService.js
│   │   ├── 📁 middleware/           # Custom middleware
│   │   │   ├── checkAuth.js
│   │   │   └── arcjet.middleware.js
│   │   ├── 📁 utils/                # Utility functions
│   │   │   ├── db.js
│   │   │   ├── validation.js
│   │   │   ├── cookieUtils.js
│   │   │   └── cloudinary.js
│   │   ├── 📁 emails/               # Email templates
│   │   └── server.js                # Server entry point
│   ├── 📁 tests/                    # Test files
│   ├── package.json
│   └── README.md
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/           # React components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ...
│   │   ├── 📁 pages/                # Page components
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── LeaseCard.jsx
│   │   │   ├── InvoiceCard.jsx
│   │   │   ├── MaintenanceCard.jsx
│   │   │   └── ...
│   │   ├── 📁 utils/                # API and utilities
│   │   │   ├── axios.js
│   │   │   ├── queries.js
│   │   │   └── formatters.js
│   │   ├── 📁 lib/                  # Libraries
│   │   │   ├── toast.js
│   │   │   └── queryClient.js
│   │   ├── 📁 constants/            # Constants
│   │   └── App.jsx                  # Main app component
│   ├── package.json
│   └── README.md
└── README.md                        # Main project README
```

---

## 👥 Contributing

We welcome contributions to RentWise! Here's how you can help:

### 🚀 Getting Started
1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a new branch for your feature
4. **Make** your changes
5. **Test** your changes thoroughly
6. **Submit** a pull request

### 📝 Code Style
- Follow **ESLint** configuration
- Use **Prettier** for code formatting
- Write **meaningful commit messages**
- Add **tests** for new features
- Update **documentation** as needed

### 🐛 Bug Reports
When reporting bugs, please include:
- **Environment** details (OS, Node version, etc.)
- **Steps** to reproduce the issue
- **Expected** vs **actual** behavior
- **Screenshots** if applicable

### 💡 Feature Requests
For new features, please:
- **Check** existing issues first
- **Describe** the problem you're solving
- **Provide** detailed requirements
- **Consider** the impact on existing users

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Express.js** - For the robust server framework
- **MongoDB** - For the flexible database solution
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For beautiful animations
- **Arcjet** - For advanced security features
- **Cloudinary** - For image management solutions

---

<div align="center">

### 🌟 Star this repository if you found it helpful!

**Built with ❤️ for property managers worldwide**

[⬆ Back to top](#-rentwise---property-management-system)

</div>

---

## 📞 Support

For support and questions:
- **📧 Email**: support@rentwise.com
- **💬 Discord**: [Join our community](https://discord.gg/rentwise)
- **📚 Documentation**: [docs.rentwise.com](https://docs.rentwise.com)
- **🐛 Issues**: [GitHub Issues](https://github.com/yourusername/rentwise/issues)

---

*Last updated: October 2025*