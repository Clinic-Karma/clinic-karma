# 🏥 Clinic Karma — Healthcare Management System

Clinic Karma is a comprehensive full-stack healthcare management system built using **React (Vite)** and **Node.js (Express)** with a PostgreSQL database.  
It supports multiple user roles such as patients, doctors, receptionists, branch managers, and top managers with complete authentication and authorization.

## Architecture documentation

- [Application architecture](docs/ARCHITECTURE.md)
- [Definitive database model](docs/DATABASE_MODEL.md)

---

## 🚀 Tech Stack

**Frontend:** React + TypeScript + Tailwind CSS + Vite + shadcn/ui  
**Backend:** Node.js + Express + PostgreSQL  
**Authentication:** JWT with refresh tokens  
**Deployment:** Vercel (frontend) + Render (backend)  
**CI/CD:** GitHub Actions automated pipeline

---

## ⚙️ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** for different user types
- **Protected routes** with proper error handling (401, 403, 404)
- **Secure logout** functionality
- **Automatic token refresh** for seamless user experience

### 👥 User Roles & Dashboards
- **Patients**: Appointment booking, lab reports, billing, profile management
- **Doctors**: Patient management, appointment scheduling, medical records
- **Receptionists**: Appointment management, patient registration
- **Branch Managers**: Staff management, doctor management, branch operations
- **Top Managers**: System-wide analytics, revenue tracking, insurance management
- **Lab Coordinators**: Lab report management, test result processing

### 🏥 Core Features
- **Appointment booking system** with real-time availability
- **Patient records & messaging** system
- **File upload** for lab reports with secure storage
- **Billing and payment tracking** with insurance integration
- **Editor directories and files** management
- **Responsive UI** with modern design
- **Centralized API design** with controllers and routers

---

## 🛡️ Security Features

- **Route Protection**: All sensitive routes require authentication
- **Role-based Access**: Users can only access their designated dashboards
- **Input Validation**: Comprehensive validation on all user inputs
- **Error Handling**: Proper HTTP status codes and user-friendly error messages
- **Session Management**: Secure login/logout with proper token handling

---

## 📁 Project Structure

```
clinic-karma-main/
├── backend/                 # Node.js Express server
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── middleware/      # Authentication & validation
│   │   ├── routes/          # API route definitions
│   │   ├── db_utils/        # Database utilities
│   │   └── utils/           # Helper functions
│   └── uploads/             # File upload storage
├── frontend/                # React TypeScript application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── pages/           # Page components
│   │   └── hooks/           # Custom React hooks
└── AUTHENTICATION_IMPLEMENTATION.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sandi-Divya/clinic-karma.git
   cd clinic-karma
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm ci
   npm run setup:env
   # Add your Neon/PostgreSQL URL to backend/.env, then initialize the DB:
   npm run db:migrate
   npm run db:seed
   npm run db:check
   npm run db:verify
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the backend directory:
```env
DATABASE_URL=your_postgresql_connection_string
ACCESS_TOKEN_SECRET=your_generated_access_token_secret
REFRESH_TOKEN_SECRET=your_generated_refresh_token_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 🧠 Deployment Workflow

1. Push to `Branch-1` → triggers GitHub Actions CI
2. Build and test React + Express
3. Auto-deploy frontend → Vercel
4. Auto-deploy backend → Render

---

## 🔧 Development

### Authentication Flow
```
User → Login → JWT Token → Protected Route → Role Check → Access Granted/Denied
```

### API Endpoints
- **Authentication**: `/api/auth/*`
- **Patient**: `/api/patient/*`
- **Doctor**: `/api/doctor/*`
- **Appointments**: `/api/appointments/*`
- **Managers**: `/api/topmanagers/*`, `/api/branchmanagers/*`

---

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Support

For support, email support@clinickarma.com or create an issue in this repository.

---

**Built with ❤️ for better healthcare management**
