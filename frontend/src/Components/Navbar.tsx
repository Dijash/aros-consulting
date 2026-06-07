import { memo, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import squareLogo from '../assets/images/Square Org.jpg';

interface NavbarProps {
  user?: { name: string; email: string; role: string } | null;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onLogout?: () => void;
}

const Navbar = ({ user, onLoginClick, onRegisterClick, onLogout }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  const handleMenuToggle = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  const scrollTo = (id: string) => {
    closeMenu();
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''}>
        <a href="#hero" className="nav-logo" onClick={e => { e.preventDefault(); scrollTo('hero'); }}>
          <img className="nav-logo-img" src={squareLogo} alt="Aros Octa Consulting Logo" />
          Aros Octa Consulting
        </a>

        <ul className="nav-links">
          {['about','services','mentors','testimonials','blog','contact'].map(id => (
            <li key={id}>
              <a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>
                {id === 'blog' ? 'Resources' : id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          {user ? (
            <>
              <a href={user?.role === 'admin' ? '/admin' : '/user'} className="nav-btn">
                Dashboard
              </a>
              <a href="#logout" className="nav-btn nav-btn-ghost" onClick={e => { e.preventDefault(); onLogout?.(); }}>
                Logout
              </a>
            </>
          ) : (
            <a href="#login" className="nav-btn" onClick={e => { e.preventDefault(); onLoginClick?.(); }}>
              Login
            </a>
          )}
          <a href="#register" className="nav-btn" onClick={e => { e.preventDefault(); onRegisterClick?.(); }}>
            Get Started
          </a>
        </div>

        <button
          className={`mobile-toggle${menuOpen ? ' active' : ''}`}
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" onClick={closeMenu}>
          <button className="mobile-close" onClick={closeMenu} aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <ul className="mobile-nav-links" onClick={e => e.stopPropagation()}>
            {['about','services','mentors','testimonials','blog','contact'].map(id => (
              <li key={id}>
                <a href={`#${id}`} className="mob-link" onClick={e => { e.preventDefault(); scrollTo(id); }}>
                  {id === 'blog' ? 'Resources' : id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              </li>
            ))}
            <li>
              {user ? (
                <a href={user?.role === 'admin' ? '/admin' : '/user'} className="mob-link" onClick={closeMenu}>
                  Dashboard
                </a>
              ) : (
                <a href="#login" className="mob-link" onClick={e => { e.preventDefault(); onLoginClick?.(); }}>
                  Login
                </a>
              )}
            </li>
            {user && (
              <li>
                <a href="#logout" className="mob-link" onClick={e => { e.preventDefault(); onLogout?.(); }}>
                  Logout
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default memo(Navbar);