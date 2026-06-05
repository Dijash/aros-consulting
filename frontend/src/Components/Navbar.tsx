import { memo, useEffect, useState } from 'react';
import squareLogo from '../assets/images/Square Org.jpg';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

        <a href="#contact" className="nav-btn" onClick={e => { e.preventDefault(); scrollTo('contact'); }}>
          Get Started
        </a>

        <button
          className={`mobile-toggle${menuOpen ? ' active' : ''}`}
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' active' : ''}`}>
        <ul className="mobile-nav-links">
          {['about','services','mentors','testimonials','blog','contact'].map(id => (
            <li key={id}>
              <a href={`#${id}`} className="mob-link" onClick={e => { e.preventDefault(); scrollTo(id); }}>
                {id === 'blog' ? 'Resources' : id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default memo(Navbar);