import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import FabricatorDashboard from '@/pages/FabricatorDashboard';
import DealerDashboard from '@/pages/DealerDashboard';
import DistributorDashboard from '@/pages/DistributorDashboard';
import CompanyDashboard from '@/pages/CompanyDashboard';
import ProfilePage from '@/pages/ProfilePage';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen">
            <Helmet>
              <title>Fabricator Incentive Management System</title>
              <meta name="description" content="Complete incentive management platform for fabricators, dealers, and distributors with approval workflows and points system." />
            </Helmet>
            
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route 
                path="/fabricator" 
                element={
                  <ProtectedRoute allowedRoles={['fabricator']}>
                    <FabricatorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dealer" 
                element={
                  <ProtectedRoute allowedRoles={['dealer']}>
                    <DealerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/distributor" 
                element={
                  <ProtectedRoute allowedRoles={['distributor']}>
                    <DistributorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/company" 
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <CompanyDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedRoles={['fabricator', 'dealer', 'distributor', 'company']}>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            
            <Toaster />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;