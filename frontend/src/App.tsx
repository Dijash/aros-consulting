import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import LoginModal from './Components/LoginModal';
import Homepage from './Pages/Homepage';
import Servicepage from './Pages/Servicepage';
import AdminLayout from './Pages/Admin/layout';

const AppContent = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const navigate = useNavigate();

  const handleLogin = (loggedInUser: { name: string; email: string; role: string }) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'admin') {
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <Navbar user={user} onLoginClick={() => setLoginOpen(true)} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/servicepage" element={<Servicepage />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
      <Footer />
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
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