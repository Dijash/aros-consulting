import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Body from '../Admin/body';
 
const NAV = [
  { label: 'Overview',     icon: '📊', path: '/admin' },
  { label: 'Submissions',  icon: '📬', path: '/admin/submissions' },
  { label: 'Students',     icon: '🎓', path: '/admin/students' },
  { label: 'Testimonials', icon: '💬', path: '/admin/testimonials' },
  { label: 'Blog Posts',   icon: '📝', path: '/admin/blog' },
];
 
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
 
  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      background: '#0a0a0a', color: '#fff',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 220,
        background: '#111',
        borderRight: '1px solid #1e1e1e',
        display: 'flex', flexDirection: 'column',
        transition: 'width .25s ease',
        flexShrink: 0,
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '1.4rem 0' : '1.4rem 1.25rem',
          borderBottom: '1px solid #1e1e1e',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 10,
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#cc1111', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
              }}>A</div>
              <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.03em', color: '#fff' }}>
                Aros Admin
              </span>
            </div>
          )}
          {collapsed && (
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: '#cc1111', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
            }}>A</div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#555', fontSize: 16, padding: 0,
              display: collapsed ? 'none' : 'block',
            }}
          >
            ←
          </button>
        </div>
 
        {/* Nav */}
        <nav style={{ padding: '1rem 0', flex: 1 }}>
          {NAV.map(item => {
            const active = pathname === item.path ||
              (item.path !== '/admin' && pathname.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center',
                gap: 10, padding: collapsed ? '0.7rem 0' : '0.7rem 1.25rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textDecoration: 'none',
                color: active ? '#fff' : '#666',
                background: active ? '#1a1a1a' : 'transparent',
                borderLeft: active ? '2px solid #cc1111' : '2px solid transparent',
                fontSize: 13, fontWeight: active ? 500 : 400,
                transition: 'all .15s',
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>
 
        {/* Collapse toggle at bottom */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#555', fontSize: 18, padding: '1rem 0',
              display: 'block', width: '100%', textAlign: 'center',
            }}
          >→</button>
        )}
 
        {/* Back to site */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1e1e1e' }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            textDecoration: 'none', color: '#444', fontSize: 12,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}>
            <span>🌐</span>
            {!collapsed && 'Back to site'}
          </Link>
        </div>
      </aside>
 
      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Body/>
      </main>
    </div>
  );
}