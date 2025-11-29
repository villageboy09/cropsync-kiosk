import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MarketPricesPage from './pages/MarketPricesPage';
import SeedVarietiesPage from './pages/SeedVarietiesPage';
import ProductsPage from './pages/ProductsPage';
import DroneBookingPage from './pages/DroneBookingPage';
import CropAdvisoryPage from './pages/CropAdvisoryPage';
import WeatherPage from './pages/WeatherPage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Feature Routes */}
        <Route
          path="/weather"
          element={
            <ProtectedRoute>
              <WeatherPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crop-advisory"
          element={
            <ProtectedRoute>
              <CropAdvisoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seeds"
          element={
            <ProtectedRoute>
              <SeedVarietiesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/market-prices"
          element={
            <ProtectedRoute>
              <MarketPricesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drone-booking"
          element={
            <ProtectedRoute>
              <DroneBookingPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
