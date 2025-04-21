import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import SpamCheck from './components/SpamCheck';
import LandingPage from './components/LandingPage';
import EmailVerification from './components/EmailVerification';
import OAuthRedirect from './components/Auth/OAuthRedirect';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<EmailVerification />} />
          <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <SpamCheck />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;