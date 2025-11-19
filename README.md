# SyncIoT Frontend

A modern, responsive React web application for controlling an IoT rover with real-time sensor monitoring, user authentication, and an intuitive dashboard interface.

**Live Demo:** [https://synciot-frontend.vercel.app](https://synciot-frontend.vercel.app)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Authentication](#authentication)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

SyncIoT Frontend is a React-based web application that provides a user interface for the IoT Rover Control System. It features modern authentication flows (signup/login), a responsive dashboard with rover controls, and real-time sensor monitoring capabilities.

The application is built with React 19, Vite 7, Tailwind CSS 4, and deployed on Vercel for optimal performance and scalability.

## ✨ Features

### Authentication
- 🔐 Secure user signup with email validation
- 🔑 Login with JWT-based authentication
- 🛡️ Protected routes and automatic redirects
- 📧 Password confirmation during registration
- 💾 Automatic token persistence in localStorage

### Dashboard
- 👤 User profile greeting with personalized content
- 🤖 Rover status display and control panel
- 📊 Real-time sensor monitoring interface
- ⚡ Quick action controls for rover movements
- 🚪 Secure logout functionality

### UI/UX
- 🎨 Modern design with Tailwind CSS v4
- 📱 Fully responsive layout (mobile, tablet, desktop)
- ✅ Form validation with Zod schema validation
- ⚡ Fast Hot Module Replacement (HMR) development experience
- 🎭 Smooth transitions and professional styling

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 19.2.0 |
| **Build Tool** | Vite | 7.2.2 |
| **Styling** | Tailwind CSS | 4.x (with @tailwindcss/vite) |
| **Routing** | React Router DOM | 7.9.6 |
| **HTTP Client** | Axios | 1.13.2 |
| **State Management** | React Context API | - |
| **Form Handling** | React Hook Form | 7.66.1 |
| **Validation** | Zod | 4.1.12 |
| **UI Components** | shadcn/ui components | - |
| **Icons** | Lucide React | 0.554.0 |
| **Code Quality** | ESLint | 9.39.1 |
| **Hosting** | Vercel | - |

## 📋 Prerequisites

Before getting started, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **Git** for version control
- Access to the backend API (running locally or deployed)

Check your versions:
```bash
node --version
npm --version
```

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ratinto/synciot_frontend.git
cd synciot_frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=SyncIoT
```

For production (Vercel), add these environment variables in your Vercel dashboard:
- `VITE_API_URL=https://synciot-backend.vercel.app/api`
- `VITE_APP_NAME=SyncIoT`

### 4. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## ⚙️ Environment Setup

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# App Name
VITE_APP_NAME=SyncIoT
```

**Note:** Variables must be prefixed with `VITE_` to be accessible in the browser.

### Development Environment
For local development with backend running on `localhost:3001`:
```
VITE_API_URL=http://localhost:3001/api
```

### Production Environment
For Vercel deployment with backend on Vercel:
```
VITE_API_URL=https://synciot-backend.vercel.app/api
```

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── assets/                # Images, fonts, media
│   ├── components/            # Reusable UI components
│   │   ├── Button.jsx         # Custom button component
│   │   ├── Input.jsx          # Custom input component
│   │   └── ...                # Other shadcn/ui components
│   ├── context/               # React Context
│   │   └── AuthContext.jsx    # Global authentication state
│   ├── pages/                 # Page components
│   │   ├── Login.jsx          # Login page
│   │   ├── Signup.jsx         # Registration page
│   │   ├── Dashboard.jsx      # Protected dashboard
│   │   └── NotFound.jsx       # 404 page
│   ├── services/              # API services
│   │   └── authService.js     # Authentication API calls
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

### Key Directory Descriptions

- **`components/`** - Reusable UI components (Button, Input, Form fields)
- **`context/`** - React Context API for global state (Authentication)
- **`pages/`** - Full-page components (Login, Signup, Dashboard)
- **`services/`** - API client functions and data fetching logic

## 📜 Available Scripts

### Development
```bash
# Start development server with HMR
npm run dev
```
Runs Vite dev server at `http://localhost:5173`

### Production Build
```bash
# Build for production
npm run build
```
Creates optimized build in `dist/` directory

### Preview Build
```bash
# Preview production build locally
npm run preview
```
Serves the production build locally for testing

### Linting
```bash
# Run ESLint to check code quality
npm run lint
```
Validates code for style and best practices

## 🔐 Authentication

### Authentication Flow

1. **Signup**
   - User enters email, name, password, and password confirmation
   - Frontend validates form with Zod schema
   - Password sent to backend for hashing
   - User created in PostgreSQL database
   - JWT token generated and stored

2. **Login**
   - User enters email and password
   - Backend validates credentials
   - JWT token returned and stored in localStorage
   - User redirected to dashboard

3. **Protected Routes**
   - ProtectedRoute component checks for valid token
   - Invalid/missing token redirects to login page
   - Token automatically added to API requests

### JWT Token Management

Tokens are stored in `localStorage` with key `auth_token`:
```javascript
// Token is automatically added to all API requests
Authorization: Bearer <token>
```

Tokens expire after 24 hours and require re-login.

### AuthContext

The `AuthContext` provides global authentication state:
```jsx
const { user, login, signup, logout, isAuthenticated } = useAuth();
```

## 🔌 API Integration

### Base Configuration

All API requests are made through the `authService.js` which uses Axios:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### Authentication Endpoints

#### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "hashedPassword"
}

Response:
{
  "user": { "id": 1, "email": "user@example.com", "name": "John Doe" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "hashedPassword"
}

Response:
{
  "user": { "id": 1, "email": "user@example.com", "name": "John Doe" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Automatic Token Injection

The Axios instance automatically includes the JWT token in Authorization headers:
```javascript
// Token from localStorage is automatically added
headers: {
  Authorization: `Bearer ${token}`
}
```

## 🚀 Deployment

### Deploying to Vercel

1. **Connect Repository**
   - Push code to GitHub
   - Connect repo to Vercel dashboard

2. **Environment Variables**
   - Add `VITE_API_URL` and `VITE_APP_NAME` in Vercel dashboard
   - Settings → Environment Variables

3. **Build Configuration**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Deploy**
   - Automatic deployment on push to main branch
   - Manual deploy from Vercel dashboard

**Live URL:** [https://synciot-frontend.vercel.app](https://synciot-frontend.vercel.app)

## 📖 Usage Guide

### First-Time User

1. Navigate to [https://synciot-frontend.vercel.app](https://synciot-frontend.vercel.app)
2. Click "Sign Up" to create an account
3. Enter your email, name, and password
4. Confirm your password
5. Click "Sign Up"
6. You'll be logged in automatically and redirected to Dashboard

### Existing User

1. Navigate to the app
2. Enter your email and password
3. Click "Login"
4. Access your dashboard with rover controls and sensor data

### Dashboard Features

- **User Greeting** - Personalized welcome message
- **Rover Status** - Current state and connectivity
- **Sensors** - Real-time sensor readings
- **Quick Controls** - Movement and action buttons
- **Logout** - Secure session termination

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot connect to API"
**Problem:** Frontend can't reach backend
```
Solution:
- Check VITE_API_URL in .env file
- Ensure backend server is running (npm run dev in backend folder)
- Verify CORS settings on backend
- Check network in browser DevTools
```

#### 2. "Login page shows blank"
**Problem:** React not rendering
```
Solution:
- Check vite.config.js has @vitejs/plugin-react enabled
- Clear browser cache (Ctrl+Shift+R)
- Run: npm install
- Restart dev server: npm run dev
```

#### 3. "Token not persisting"
**Problem:** Auth token lost on page refresh
```
Solution:
- Check localStorage is enabled in browser
- Verify token is being stored: localStorage.getItem('auth_token')
- Check browser DevTools → Application → Local Storage
```

#### 4. "Build fails on Vercel"
**Problem:** Production build error
```
Solution:
- Check environment variables in Vercel dashboard
- Verify all imports use correct paths
- Ensure .env.example matches actual .env
- Check build logs in Vercel dashboard
```

#### 5. "Tailwind CSS not loading"
**Problem:** Styles not applied
```
Solution:
- Verify tailwind.config.js exists and is correct
- Check vite.config.js has @tailwindcss/vite plugin
- Restart dev server after config changes
- Clear node_modules: rm -rf node_modules && npm install
```

### Debug Mode

Enable detailed logging:
```javascript
// In authService.js
console.log('API Response:', response);
console.log('Token:', localStorage.getItem('auth_token'));
```

Browser DevTools Console:
- F12 or Cmd+Option+I (Mac)
- Network tab to monitor API calls
- Application tab to check localStorage

### Getting Help

1. Check browser console for errors (F12)
2. Check backend logs (terminal where backend runs)
3. Verify environment variables are set
4. Check network requests in DevTools
5. Review error messages carefully

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Zod Validation](https://zod.dev)
- [Axios Documentation](https://axios-http.com)

## 📝 Notes

- All API URLs are configured via environment variables
- Token expiration: 24 hours
- Password hashing performed on backend using bcryptjs
- Support for future OAuth integrations (GitHub, Google placeholders)

## 🔗 Related Projects

- **Backend:** [synciot_backend](https://github.com/ratinto/synciot_backend)
- **Database:** PostgreSQL on Aiven Cloud

---

**Last Updated:** November 2025
**Status:** Production Ready ✅
