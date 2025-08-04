import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import UploadData from './pages/UploadData';
import AnalysisResults from './pages/AnalysisResults';
import WhatIfScenarios from './pages/WhatIfScenarios';
import ChartViews from './pages/ChartViews';
import AccountSettings from './pages/AccountSettings';
import HelpDocumentation from './pages/HelpDocumentation';

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

// Public Route component (redirect to dashboard if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardOverview />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UploadData />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/analysis" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AnalysisResults />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/scenarios" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <WhatIfScenarios />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/charts" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ChartViews />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AccountSettings />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <HelpDocumentation />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;