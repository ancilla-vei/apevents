import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Public pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';

// Customer pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerBookings from './pages/customer/CustomerBookings';
import CustomerQuotations from './pages/customer/CustomerQuotations';
import CustomerMessages from './pages/customer/CustomerMessages';
import CustomerProfile from './pages/customer/CustomerProfile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminQuotations from './pages/admin/AdminQuotations';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminServices from './pages/admin/AdminServices';
import AdminCategories from './pages/admin/AdminCategories';
import AdminGallery from './pages/admin/AdminGallery';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex-center" style={{minHeight:'100vh'}}><div className="spinner"/></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />;
  return children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Customer */}
            <Route path="/dashboard" element={<PrivateRoute role="customer"><CustomerDashboard /></PrivateRoute>}>
              <Route index element={<CustomerBookings />} />
              <Route path="bookings" element={<CustomerBookings />} />
              <Route path="quotations" element={<CustomerQuotations />} />
              <Route path="messages" element={<CustomerMessages />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>}>
              <Route index element={<AdminBookings />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="quotations" element={<AdminQuotations />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </AuthProvider>
    </ThemeProvider>
  );
}
