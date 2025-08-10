import React from 'react';
import { Route, Switch, Redirect } from "wouter";
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { queryClient } from '@/lib/queryClient';
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
import IncidentsListPage from './pages/IncidentsListPage';
import IncidentReportPage from './pages/IncidentReportPage';
import RCAResultsPage from './pages/RCAResultsPage';

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
  <QueryClientProvider client={queryClient}>
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
        <Route path="/incidents" nest>
          <ProtectedRoute>
            <Route path="/">
              <DashboardLayout>
                <IncidentsListPage />
              </DashboardLayout>
            </Route>
            <Route path="/new">
              <IncidentReportPage />
            </Route>
            <Route path="/:id/rca">
              <RCAResultsPage />
            </Route>
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
  </QueryClientProvider>
);

export default App;
