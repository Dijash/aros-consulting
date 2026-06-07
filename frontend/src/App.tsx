import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import LoginModal from './Components/LoginModal';
import RegisterModal from './Components/RegisterModal';
import Homepage from './Pages/Homepage';
import Servicepage from './Pages/Servicepage';
import AdminLayout from './Pages/Admin/layout';
import UserLayout from './Pages/User/layout';
import useSessionTimeout from './useSessionTimeout';

const API = import.meta.env.VITE_API_URL || 'https://aros-consulting-fofj.vercel.app';

const ProtectedRoute = ({ user, checkingAuth, children }: { user: { name: string; email: string; role: string } | null; checkingAuth: boolean; children: React.ReactNode }) => {
  if (checkingAuth) {
    return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0a0a0a', color:'#555', fontFamily:'Outfit, sans-serif' }}>Loading...</div>;
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const ProtectedUserRoute = ({ user, checkingAuth, children }: { user: { name: string; email: string; role: string } | null; checkingAuth: boolean; children: React.ReactNode }) => {
  if (checkingAuth) {
    return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0a0a0a', color:'#555', fontFamily:'Outfit, sans-serif' }}>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(() => !!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/user');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) return;
    fetch(`${API}/admin/me`, {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then(data => {
        setToken(savedToken);
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  const handleLogin = (loggedInUser: { name: string; email: string; role: string }, authToken: string) => {
    setUser(loggedInUser);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    if (loggedInUser.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  };

  const handleRegister = (newUser: { name: string; email: string; role: string }, authToken: string) => {
    setUser(newUser);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    toast.success('Account created!');
  };

  const handleLogout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  }, [navigate]);

  useSessionTimeout(
    !!user,
    user?.role === 'admin',
    handleLogout,
  );

  return (
    <>
      {!isDashboard && <Navbar user={user} onLoginClick={() => setLoginOpen(true)} onRegisterClick={() => setRegisterOpen(true)} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/servicepage/:slug" element={<Servicepage user={user} token={token} />} />
        <Route path="/servicepage" element={<Servicepage user={user} token={token} />} />
        <Route path="/admin/*" element={
          <ProtectedRoute user={user} checkingAuth={checkingAuth}>
            <AdminLayout token={token || ''} />
          </ProtectedRoute>
        } />
        <Route path="/user/*" element={
          <ProtectedUserRoute user={user} checkingAuth={checkingAuth}>
            <UserLayout token={token || ''} onLogout={handleLogout} />
          </ProtectedUserRoute>
        } />
      </Routes>
      <Footer />
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
        onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true); }}
      />
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegister={handleRegister}
        onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true); }}
      />
      <Toaster position="top-right" />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
