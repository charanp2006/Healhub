# HealHub - Healthcare Appointment Platform

HealHub is a comprehensive healthcare management platform that connects patients with doctors and healthcare facilities. The application provides an intuitive interface for finding doctors by specialty, booking appointments, and managing healthcare services.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

HealHub is a full-stack web application designed to streamline the healthcare appointment booking process. It enables users to:

- Browse doctors by medical specialty
- Search for hospitals and healthcare facilities
- Book appointments with healthcare providers
- Manage personal profiles and appointment history
- Access healthcare information and resources

The application is built with modern web technologies, featuring a responsive React frontend and a Node.js/Express backend integrated with Firebase for authentication and data storage.

## ✨ Features

### User Features

- **User Authentication**
  - Secure sign up and login with email/password
  - User profile management
  - Session persistence

- **Doctor Search & Discovery**
  - Browse doctors by medical specialty
  - View doctor profiles and information
  - Filter and search functionality

- **Hospital & Facility Search**
  - Search hospitals by category
  - View facility details and services
  - Location-based search

- **Appointment Management**
  - Book appointments with doctors
  - Schedule hospital visits
  - View appointment history
  - Manage upcoming appointments

- **User Dashboard**
  - Personal profile management
  - Appointment history
  - Account settings

### Technical Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Firebase Integration**: Authentication and Firestore database
- **RESTful API**: Backend API for user and appointment management
- **Real-time Data**: Firebase real-time database updates
- **Secure Authentication**: Firebase Authentication with token-based API access

## 🛠 Technology Stack

### Frontend

- **React 19.1.1** - UI library
- **React Router 7.8.0** - Client-side routing
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Vite 7.1.0** - Build tool and development server
- **Firebase 10.14.1** - Authentication and Firestore
- **Axios 1.11.0** - HTTP client for API requests
- **React Toastify 11.0.5** - Toast notifications
- **Lucide React 0.562.0** - Icon library

### Backend

- **Node.js** - Runtime environment
- **Express 4.18.2** - Web framework
- **Firebase Admin SDK 12.0.0** - Server-side Firebase operations
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 16.3.1** - Environment variable management

### Database & Services

- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database
- **Firebase Admin SDK** - Server-side operations

## 📁 Project Structure

```
healhub/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/         # Images, icons, and static files
│   │   ├── components/     # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Banner.jsx
│   │   │   ├── SpecialityMenu.jsx
│   │   │   ├── TopDoctors.jsx
│   │   │   └── ...
│   │   ├── context/         # React context providers
│   │   │   └── AppContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Hospitals.jsx
│   │   │   ├── Appointment.jsx
│   │   │   ├── MyProfile.jsx
│   │   │   ├── MyAppointments.jsx
│   │   │   └── ...
│   │   ├── services/       # API and service functions
│   │   │   ├── authService.js
│   │   │   ├── apiService.js
│   │   │   └── appointmentService.js
│   │   ├── config/         # Configuration files
│   │   │   └── firebase.js
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Application entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   │   └── firebase.js
│   │   ├── middleware/     # Express middleware
│   │   │   └── authMiddleware.js
│   │   ├── routes/        # API route handlers
│   │   │   ├── userRoutes.js
│   │   │   └── appointmentRoutes.js
│   │   ├── services/      # Business logic services
│   │   │   ├── authService.js
│   │   │   └── firestoreService.js
│   │   └── index.js       # Server entry point
│   ├── package.json
│   └── README.md
│
├── README.md               # This file
├── SETUP.md                # Detailed setup guide
├── COMMANDS.md             # Command reference
├── FRONTEND_BACKEND_CONNECTION.md  # API connection guide
└── CONNECTION_SUMMARY.md   # Quick connection reference
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase account** (for authentication and database)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd healhub
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm install firebase
```

#### 3. Backend Setup

```bash
cd backend
npm install
```

### Configuration

#### Frontend Configuration

1. Create a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

#### Backend Configuration

1. Create a `.env` file in `backend/`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Authentication** → **Email/Password** provider
4. Enable **Firestore Database** (start in test mode for development)
5. Get your Firebase configuration from **Project Settings** → **General**
6. Add the configuration to your frontend `.env` file

### Running the Application

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will be available at `http://localhost:5173`

#### Start Backend Server

```bash
cd backend
npm start
```

Backend will be available at `http://localhost:5000`

For development with auto-reload:

```bash
npm run dev
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

### User Endpoints

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `POST /api/users/sync` - Sync Firebase Auth user with Firestore

### Appointment Endpoints

- `POST /api/appointments` - Create a new appointment
- `GET /api/appointments` - Get all user appointments
- `GET /api/appointments/:id` - Get specific appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

For detailed API documentation, see [FRONTEND_BACKEND_CONNECTION.md](./FRONTEND_BACKEND_CONNECTION.md)

## 💻 Development

### Frontend Development

```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Development

```bash
cd backend
npm start        # Start server
npm run dev      # Start with auto-reload
```

### Code Structure

- **Components**: Reusable UI components in `frontend/src/components/`
- **Pages**: Route components in `frontend/src/pages/`
- **Services**: API and business logic in `frontend/src/services/` and `backend/src/services/`
- **Routes**: API endpoints in `backend/src/routes/`
- **Middleware**: Express middleware in `backend/src/middleware/`

## 🔒 Security

- **Authentication**: Firebase Authentication with secure token-based access
- **Authorization**: Server-side token verification for all protected routes
- **Data Validation**: Input validation on both client and server
- **CORS**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in `.env` files (not committed to git)

## 🚢 Deployment

### Frontend Deployment

1. Build the production bundle:

```bash
cd frontend
npm run build
```

2. Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)

3. Update environment variables in your hosting platform

### Backend Deployment

1. Set up a Node.js hosting service (Heroku, Railway, AWS, etc.)

2. Configure environment variables

3. Deploy the backend code

4. Update `VITE_API_BASE_URL` in frontend to point to your backend URL

### Firebase Configuration

- Ensure Firestore security rules are properly configured
- Set up production Firebase project
- Configure CORS for production domain

## 📖 Additional Documentation

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [COMMANDS.md](./COMMANDS.md) - Command reference guide
- [FRONTEND_BACKEND_CONNECTION.md](./FRONTEND_BACKEND_CONNECTION.md) - API connection guide
- [CONNECTION_SUMMARY.md](./CONNECTION_SUMMARY.md) - Quick connection reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

HealHub Development Team

## 🙏 Acknowledgments

- Firebase for authentication and database services
- React and Tailwind CSS communities
- All contributors and users

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**HealHub** - Making healthcare accessible, one appointment at a time.
