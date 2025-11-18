import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MarketPricesPage from './pages/MarketPricesPage';
import SeedVarietiesPage from './pages/SeedVarietiesPage';
import ProductsPage from './pages/ProductsPage';
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
        
        {/* Placeholder routes for features - will be implemented next */}
        <Route 
          path="/weather" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold font-telugu">వాతావరణం</h1>
                  <p className="text-xl font-telugu">త్వరలో వస్తుంది...</p>
                  <p className="text-lg font-poppins text-gray-600">Coming Soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/crops" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold font-telugu">పంట సలహాలు</h1>
                  <p className="text-xl font-telugu">త్వరలో వస్తుంది...</p>
                  <p className="text-lg font-poppins text-gray-600">Coming Soon...</p>
                </div>
              </div>
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
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold font-telugu">డ్రోన్ బుకింగ్</h1>
                  <p className="text-xl font-telugu">త్వరలో వస్తుంది...</p>
                  <p className="text-lg font-poppins text-gray-600">Coming Soon...</p>
                </div>
              </div>
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
