import { memo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { services, getServiceBySlug } from '../data/services';
import { val } from '../validation';
import FadeUp from '../Components/FadeUp';
import quickbooksImg from "../assets/images/Quickbooks.png";
import xeroImg from "../assets/images/Xero_software_logo.svg.png";

import API from '../api';

const serviceIcons: Record<string, React.ReactNode> = {
  "quickbooks-training": <img src={quickbooksImg} alt="QuickBooks" />,
  "xero-certification-prep": <img src={xeroImg} alt="Xero" />,
  "global-opportunity-program": (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  "myob-sage-training": (
    <svg viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  "one-on-one-mentorship": (
    <svg viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  "excel-for-accountants": (
    <svg viewBox="0 0 24 24">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

const Servicepage = ({ user, token }: { user: { name: string; email: string; role: string } | null; token: string | null }) => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : services[0];
  const isLoggedIn = !!token && !!user;
  const [form, setForm] = useState({ name: isLoggedIn ? user!.name : '', email: isLoggedIn ? user!.email : '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!service) {
    return (
      <div className="sd-root">
        <div className="sd-empty">
          <h2>Service not found</h2>
          <Link to="/" className="sd-back-link">Back to home</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!isLoggedIn) {
      const nameErr = val.name(form.name);
      if (nameErr) errs.name = nameErr;
      const emailErr = val.email(form.email);
      if (emailErr) errs.email = emailErr;
    }
    const phoneErr = val.phone(form.phone);
    if (phoneErr) errs.phone = phoneErr;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          course: service.title,
          enrolled: new Date().toISOString().slice(0, 10),
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      toast.success('Enrollment submitted!');
    } catch {
      toast.error('Failed to submit enrollment.');
    } finally {
      setSubmitting(false);
    }
  };

  const errClass = (key: string) => errors[key] ? 'sd-enroll-input-error' : '';

  return (
    <div className="sd-root">
      <div className="sd-hero">
        <Link to="/" className="sd-back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to home
        </Link>
        <div className="sd-hero-content">
          <div className="sd-hero-icon">{serviceIcons[service.slug]}</div>
          <span className="sd-hero-num">{service.num}</span>
          <h1>{service.title}</h1>
          <p>{service.desc}</p>
          <span className="sd-tag">{service.tag}</span>
        </div>
      </div>

      <div className="sd-body">
        <FadeUp><section className="sd-section">
          <h2>Overview</h2>
          <p>{service.details.overview}</p>
        </section></FadeUp>

        <div className="sd-split">
          <FadeUp><section className="sd-section">
            <h2>Benefits</h2>
            <ul className="sd-list">
              {service.details.benefits.map((b, i) => (
                <li key={i}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </section></FadeUp>

          <FadeUp><section className="sd-section">
            <h2>Curriculum</h2>
            <ul className="sd-list">
              {service.details.curriculum.map((c, i) => (
                <li key={i}>
                  <span className="sd-list-num">{String(i + 1).padStart(2, '0')}</span>
                  {c}
                </li>
              ))}
            </ul>
          </section></FadeUp>
        </div>

        <FadeUp><div className="sd-meta">
          <div className="sd-meta-item">
            <div className="sd-meta-label">Duration</div>
            <div className="sd-meta-value">{service.details.duration}</div>
          </div>
          <div className="sd-meta-item">
            <div className="sd-meta-label">Target Audience</div>
            <div className="sd-meta-value">{service.details.target}</div>
          </div>
        </div></FadeUp>

        <FadeUp><div className="sd-enroll" id="enroll">
          <h2>Enroll Now</h2>
          {submitted ? (
            <div className="sd-enroll-success">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <h3>You're enrolled!</h3>
              <p>We'll reach out to you shortly with the next steps for <strong>{service.title}</strong>.</p>
              <Link to="/" className="sd-cta-btn">Back to Home</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="sd-enroll-form" noValidate>
              {isLoggedIn && (
                <div className="sd-enroll-logged-in">
                  Enrolling as <strong>{user!.name}</strong> — your account details are used automatically.
                </div>
              )}
              <div className="sd-enroll-fields">
                <div>
                  <label className="sd-enroll-label">Full Name *</label>
                  <input
                    type="text" required
                    value={form.name}
                    onChange={e => { setForm({ ...form, name: e.target.value }); setErrors(p => ({ ...p, name: '' })); }}
                    className={`sd-enroll-input ${errClass('name')}`}
                    placeholder="Your full name"
                    disabled={isLoggedIn}
                  />
                  {errors.name && <span className="sd-field-error">{errors.name}</span>}
                </div>
                <div>
                  <label className="sd-enroll-label">Email *</label>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setErrors(p => ({ ...p, email: '' })); }}
                    className={`sd-enroll-input ${errClass('email')}`}
                    placeholder="your@email.com"
                    disabled={isLoggedIn}
                  />
                  {errors.email && <span className="sd-field-error">{errors.email}</span>}
                </div>
                <div>
                  <label className="sd-enroll-label">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => { setForm({ ...form, phone: e.target.value }); setErrors(p => ({ ...p, phone: '' })); }}
                    className={`sd-enroll-input ${errClass('phone')}`}
                    placeholder="+977 98XXXXXXXX"
                  />
                  {errors.phone && <span className="sd-field-error">{errors.phone}</span>}
                </div>
                <div>
                  <label className="sd-enroll-label">Course</label>
                  <input
                    type="text"
                    value={service.title}
                    className="sd-enroll-input"
                    disabled
                  />
                </div>
              </div>
              <button type="submit" disabled={submitting} className="sd-cta-btn">
                {submitting ? 'Submitting...' : 'Submit Enrollment'}
              </button>
            </form>
          )}
        </div></FadeUp>
      </div>
    </div>
  );
};

export default memo(Servicepage);
