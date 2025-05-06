import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';
import EmailVerification from './components/EmailVerification';
import OAuthRedirect from './components/Auth/OAuthRedirect';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import UserManagement from './components/admin/UserManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<EmailVerification />} />
          <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
          <Route 
            path="/home"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <HomePage />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AuthenticatedLayout>
                  <UserManagement />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;