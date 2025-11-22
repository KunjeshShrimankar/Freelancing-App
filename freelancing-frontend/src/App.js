import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Navbar from './components/Navbar';
import { ClientDashboardModalProvider } from './pages/ClientDashboardModalContext';
import BrowseFreelancers from './pages/BrowseFreelancers';

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<><Navbar /><HomePage /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/signup" element={<><Navbar /><Signup /></>} />
          <Route
            path="/client"
            element={
              <PrivateRoute roles={["client"]}>
                <ClientDashboardModalProvider>
                  <Navbar />
                  <ClientDashboard />
                </ClientDashboardModalProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/freelancer"
            element={
              <PrivateRoute roles={["freelancer"]}>
                <Navbar />
                <FreelancerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/freelancers"
            element={<><Navbar /><BrowseFreelancers /></>}
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["admin"]}>
                <Navbar />
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<><Navbar /><NotFound /></>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 