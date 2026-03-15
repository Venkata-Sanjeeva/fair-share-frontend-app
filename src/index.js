import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import FairShareHome from './components/FairShare';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ForgotPage from './components/pages/ForgotPage';
import ProtectedRoute from './components/utils/ProtectedRoute';
import TripDetailsPage from './components/TripDetailsPage';
import TripExpenseReport from './components/TripExpenseReport';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import PageNotFound from './components/pages/PageNotFound';
import LandingPage from './components/pages/LandingPage';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />, // Default root redirect
  },
  {
    path: '/home',
    element: <LandingPage />,
  }, ,
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  // Protected Routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <FairShareHome /> {/* When logged in, FairShareHome shows LoggedInDashboard */}
      </ProtectedRoute>
    ),
  },
  {
    path: '/trip/:tripUID',
    element: <ProtectedRoute>
      <TripDetailsPage />
    </ProtectedRoute>,
  },
  {
    path: '/trip/:tripUID/report',
    element: <ProtectedRoute>
      <TripExpenseReport />
    </ProtectedRoute>,
  },
  {
    path: '*',
    element: <PageNotFound />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>
);