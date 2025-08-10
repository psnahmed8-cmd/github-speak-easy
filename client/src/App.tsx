import React from 'react';
import { Route, Switch, Redirect } from "wouter";
import { Toaster } from 'react-hot-toast';
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
  return isAuthenticated ? <>{children}</> : <Redirect to="/login" />;
}

// Public Route component (redirect to dashboard if already authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Redirect to="/dashboard" />;
}

const App = () => (
  <AuthProvider>
    <div className="min-h-screen bg-gray-900">
      <Toaster position="top-right" />
      <Switch>
        {/* Public routes */}
        <Route path="/login">
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        </Route>
        <Route path="/signup">
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        </Route>

        {/* Protected routes */}
        <Route path="/dashboard">
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardOverview />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/upload">
          <ProtectedRoute>
            <DashboardLayout>
              <UploadData />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/analysis">
          <ProtectedRoute>
            <DashboardLayout>
              <AnalysisResults />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/scenarios">
          <ProtectedRoute>
            <DashboardLayout>
              <WhatIfScenarios />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/charts">
          <ProtectedRoute>
            <DashboardLayout>
              <ChartViews />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/settings">
          <ProtectedRoute>
            <DashboardLayout>
              <AccountSettings />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>
        <Route path="/help">
          <ProtectedRoute>
            <DashboardLayout>
              <HelpDocumentation />
            </DashboardLayout>
          </ProtectedRoute>
        </Route>

        {/* Default redirect */}
        <Route path="/">
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    </div>
  </AuthProvider>
);

export default App;
