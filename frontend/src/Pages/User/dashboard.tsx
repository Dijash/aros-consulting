import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { services } from '../../data/services';
import { val } from '../../validation';
import FadeUp from '../../Components/FadeUp';
import './User.css';

import API from '../../api';

type Enrollment = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  enrolled: string;
  status: 'active' | 'completed' | 'dropped';
  createdAt: string;
};

export default function UserDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; role: string; createdAt?: string; photo?: string; phone?: string } | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const [testiQuote, setTestiQuote] = useState('');
  const [testiRole, setTestiRole] = useState('');
  const [testiErrors, setTestiErrors] = useState<Record<string, string>>({});
  const [testiSubmitting, setTestiSubmitting] = useState(false);
  const [testiDone, setTestiDone] = useState(false);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');
  const [editPhoto, setEditPhoto] = useState<string | null>(null);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await fetch(`${API}/user/dashboard`, { headers });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setEditName(data.user.name || '');
          setEditPhone(data.user.phone || '');
          setEnrollments(data.enrollments || []);
        }
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleTestiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const qErr = val.quote(testiQuote);
    if (qErr) errs.quote = qErr;
    setTestiErrors(errs);
    if (Object.keys(errs).length) return;
    setTestiSubmitting(true);
    try {
      const res = await fetch(`${API}/testimonials/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quote: testiQuote.trim(), role: testiRole.trim() }),
      });
      if (!res.ok) throw new Error();
      setTestiDone(true);
      toast.success('Testimonial submitted for review!');
    } catch {
      toast.error('Failed to submit testimonial.');
    } finally {
      setTestiSubmitting(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setEditPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const nErr = val.name(editName);
    if (nErr) errs.name = nErr;
    const pErr = val.phone(editPhone);
    if (pErr) errs.phone = pErr;
    if (editPassword) {
      const pwErr = val.password(editPassword);
      if (pwErr) errs.password = pwErr;
      const cfErr = val.confirmPassword(editPassword, editConfirmPassword);
      if (cfErr) errs.confirm = cfErr;
    }
    setEditErrors(errs);
    if (Object.keys(errs).length) return;

    setEditSubmitting(true);
    try {
      const body: Record<string, string> = { name: editName.trim(), phone: editPhone };
      if (editPassword) body.password = editPassword;
      if (editPhoto) body.photo = editPhoto;
      const res = await fetch(`${API}/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setUser(prev => prev ? { ...prev, name: updated.name, phone: updated.phone || '', photo: updated.photo || prev.photo } : prev);
      setEditPassword('');
      setEditConfirmPassword('');
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setEditSubmitting(false);
    }
  };

  const activeCount = enrollments.filter(e => e.status === 'active').length;
  const completedCount = enrollments.filter(e => e.status === 'completed').length;

  const getSlugByCourse = (courseName: string) => {
    const service = services.find(s => s.title === courseName);
    return service?.slug || null;
  };

  const editErrClass = (key: string) => editErrors[key] ? 'user-testi-input-error' : '';

  if (loading) {
    return (
      <div className="user-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ color: '#555' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-root">
      <div className="user-topbar">
        <div className="user-logo">
          <div className="user-logo-dot">A</div>
          <span className="user-logo-text">My Dashboard</span>
        </div>
        <div className="user-topbar-actions">
          <a href="/" className="user-topbar-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to site
          </a>
          <button onClick={handleLogout} className="user-btn user-btn-danger user-btn-md">Logout</button>
        </div>
      </div>

      <div className="user-content">
        <div className="user-welcome">
          <h1>Welcome back, {user?.name || 'User'}</h1>
          <p>Here's your enrollment overview.</p>
        </div>

        <div className="user-stats-grid">
          <div className="user-stat">
            <div className="user-stat-label">Total Enrollments</div>
            <div className="user-stat-value">{enrollments.length}</div>
          </div>
          <div className="user-stat">
            <div className="user-stat-label">Active</div>
            <div className="user-stat-value">{activeCount}</div>
          </div>
          <div className="user-stat">
            <div className="user-stat-label">Completed</div>
            <div className="user-stat-value">{completedCount}</div>
          </div>
        </div>

        <FadeUp><div className="user-page-header">
          <h2>Profile Information</h2>
        </div>

        <div className="user-card">
          <div className="user-profile-row">
            <div className="user-avatar">
              {user?.photo ? (
                <img src={user.photo} alt="" className="user-avatar-img" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || 'U'
              )}
            </div>
            <div>
              <div className="user-profile-name">{user?.name || 'Unknown'}</div>
              <div className="user-profile-email">{user?.email || ''}</div>
              {user?.phone && <div className="user-profile-email" style={{ marginTop: 2 }}>{user.phone}</div>}
            </div>
          </div>
          <div className="user-profile-details">
            <div className="user-detail-item">
              <div className="user-detail-label">Role</div>
              <div className="user-detail-value">
                <span className={`user-badge ${user?.role === 'admin' ? 'badge-admin' : 'user-badge-user'}`}>
                  {user?.role || 'user'}
                </span>
              </div>
            </div>
            <div className="user-detail-item">
              <div className="user-detail-label">Joined</div>
              <div className="user-detail-value">{user?.createdAt?.slice(0, 10) || 'N/A'}</div>
            </div>
          </div>
        </div></FadeUp>

        <FadeUp><div className="user-page-header" style={{ marginTop: '2rem' }}>
          <h2>Edit Profile</h2>
        </div>

        <div className="user-card">
          <form onSubmit={handleEditSubmit} noValidate>
            <div style={{ marginBottom: '14px' }}>
              <label className="user-testi-label">Name *</label>
              <input type="text" required value={editName} onChange={e => { setEditName(e.target.value); setEditErrors(p => ({ ...p, name: '' })); }} className={`user-testi-input ${editErrClass('name')}`} />
              {editErrors.name && <span className="user-field-error">{editErrors.name}</span>}
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label className="user-testi-label">Phone</label>
              <input type="tel" value={editPhone} onChange={e => { setEditPhone(e.target.value); setEditErrors(p => ({ ...p, phone: '' })); }} className={`user-testi-input ${editErrClass('phone')}`} placeholder="+977 98XXXXXXXX" />
              {editErrors.phone && <span className="user-field-error">{editErrors.phone}</span>}
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label className="user-testi-label">New Password (leave blank to keep current)</label>
              <input type="password" value={editPassword} onChange={e => { setEditPassword(e.target.value); setEditErrors(p => ({ ...p, password: '' })); }} className={`user-testi-input ${editErrClass('password')}`} placeholder="New password" autoComplete="new-password" />
              {editErrors.password && <span className="user-field-error">{editErrors.password}</span>}
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label className="user-testi-label">Confirm New Password</label>
              <input type="password" value={editConfirmPassword} onChange={e => { setEditConfirmPassword(e.target.value); setEditErrors(p => ({ ...p, confirm: '' })); }} className={`user-testi-input ${editErrClass('confirm')}`} placeholder="Confirm new password" autoComplete="new-password" />
              {editErrors.confirm && <span className="user-field-error">{editErrors.confirm}</span>}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="user-testi-label">Profile Photo</label>
              <div className="user-photo-upload">
                {editPhoto ? (
                  <img src={editPhoto} alt="Preview" className="user-photo-preview" />
                ) : user?.photo ? (
                  <img src={user.photo} alt="" className="user-photo-preview" />
                ) : (
                  <div className="user-photo-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
                <label className="user-btn user-btn-ghost user-btn-sm" style={{ cursor: 'pointer' }}>
                  Choose Photo
                  <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                </label>
                {editPhoto && (
                  <button type="button" onClick={() => setEditPhoto(null)} className="user-btn user-btn-danger user-btn-sm" style={{ fontSize: '11px', padding: '5px 12px' }}>
                    Remove
                  </button>
                )}
              </div>
            </div>
            <button type="submit" disabled={editSubmitting} className="user-btn user-btn-primary user-btn-md">
              {editSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div></FadeUp>

        {enrollments.length > 0 && (
          <>
            <div className="user-page-header" style={{ marginTop: '2rem' }}>
              <h2>My Enrolled Courses</h2>
            </div>
            <div className="user-enroll-list">
              {enrollments.map(e => {
                const slug = getSlugByCourse(e.course);
                return (
                  <div key={e._id} className={`user-enroll-item user-enroll-${e.status}`}>
                    <div className="user-enroll-top">
                      {slug ? (
                        <Link to={`/servicepage/${slug}`} className="user-enroll-title-link">
                          <h3>{e.course}</h3>
                        </Link>
                      ) : (
                        <h3>{e.course}</h3>
                      )}
                      <span className={`user-badge user-badge-${e.status}`}>{e.status}</span>
                    </div>
                    <div className="user-enroll-meta">
                      <span>Enrolled: {e.enrolled || e.createdAt?.slice(0, 10) || 'N/A'}</span>
                      {e.phone && <span>Phone: {e.phone}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="user-page-header" style={{ marginTop: '2rem' }}>
          <h2>Share Your Experience</h2>
        </div>

        <div className="user-card">
          {testiDone ? (
            <div className="user-testi-success">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h3>Thank you!</h3>
              <p>Your testimonial has been submitted and is pending admin review. It will appear on the site once approved.</p>
              <button onClick={() => { setTestiDone(false); setTestiQuote(''); setTestiRole(''); setTestiErrors({}); }} className="user-btn user-btn-primary user-btn-md">
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleTestiSubmit} noValidate>
              <div style={{ marginBottom: '14px' }}>
                <label className="user-testi-label">Your Experience *</label>
                <textarea
                  required
                  value={testiQuote}
                  onChange={e => { setTestiQuote(e.target.value); setTestiErrors(p => ({ ...p, quote: '' })); }}
                  className={`user-testi-textarea ${testiErrors.quote ? 'user-testi-input-error' : ''}`}
                  placeholder="Tell us about your experience with our courses..."
                  rows={4}
                />
                {testiErrors.quote && <span className="user-field-error">{testiErrors.quote}</span>}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label className="user-testi-label">Your Role / Title</label>
                <input
                  type="text"
                  value={testiRole}
                  onChange={e => setTestiRole(e.target.value)}
                  className="user-testi-input"
                  placeholder="e.g. QuickBooks & Xero Graduate"
                />
              </div>
              <button type="submit" disabled={testiSubmitting} className="user-btn user-btn-primary user-btn-md">
                {testiSubmitting ? 'Submitting...' : 'Submit Testimonial'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
