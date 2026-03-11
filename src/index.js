import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import FairShareHome from './components/FairShare';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ForgotPage from './components/pages/ForgotPage';
import ProtectedRoute from './components/utils/ProtectedRoute';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />, // Default root redirect
  },
  {
    path: '/home',
    element: <FairShareHome />, // This handles landing + view switching for now
  },
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
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <FairShareHome /> {/* When logged in, FairShareHome shows LoggedInDashboard */}
      </ProtectedRoute>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={routes} />
  </React.StrictMode>
);