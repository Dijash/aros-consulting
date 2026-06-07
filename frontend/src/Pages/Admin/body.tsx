import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { val } from '../../validation';
import './Admin.css'

import API from '../../api';

type Submission = {
  _id: string; firstName: string; lastName: string;
  email: string; interest: string; message: string;
  createdAt: string; status?: string;
};
type Student = {
  _id: string; name: string; email: string; phone: string;
  course: string; enrolled: string; status: 'active' | 'completed' | 'dropped';
};
type Testimonial = {
  _id: string; name: string; role: string; quote: string;
  visible: boolean; date: string;
};
type BlogPost = {
  _id: string; title: string; category: string;
  readTime: string; date: string; published: boolean; author: string;
};
type AppUser = {
  _id: string; name: string; email: string; role: string; createdAt: string;
};

const Badge = ({ label }: { label: string }) => {
  const safe = String(label).toLowerCase().replace(/\s+/g, '-');
  return <span className={`admin-badge admin-badge-${safe}`}>{label}</span>;
};

const PageHeader = ({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) => (
  <div className="admin-page-header">
    <div>
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
    </div>
    {action}
  </div>
);

const Stat = ({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) => (
  <div className={`admin-stat${accent ? ' accent' : ''}`}>
    <div className="admin-stat-label">{label}</div>
    <div className="admin-stat-value">{value}</div>
  </div>
);

const Overview = ({ submissions, students, testimonials, blog }: {
  submissions: Submission[]; students: Student[];
  testimonials: Testimonial[]; blog: BlogPost[];
}) => (
    <div>
    <PageHeader title="Overview" sub="Welcome back — here's what's happening." />
    <div className="admin-stats-grid">
      <Stat label="Total Submissions" value={submissions.length} accent />
      <Stat label="New Unread" value={submissions.filter(s => s.status !== 'read' && s.status !== 'replied').length} />
      <Stat label="Total Students" value={students.length} />
      <Stat label="Active Students" value={students.filter(s => s.status === 'active').length} />
      <Stat label="Published Posts" value={blog.filter(b => b.published).length} />
      <Stat label="Visible Testimonials" value={testimonials.filter(t => t.visible).length} />
    </div>

    <div className="admin-two-col">
      <div className="admin-card">
        <h3 className="admin-card-title">Recent Submissions</h3>
        {submissions.slice(0, 4).map(s => (
          <div key={s._id} className="admin-overview-row">
            <div>
              <div className="admin-overview-name">{s.firstName} {s.lastName}</div>
              <div className="admin-overview-sub">{s.interest}</div>
            </div>
            <Badge label={s.status || 'new'} />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title">Students by Course</h3>
        {['QuickBooks Training', 'Xero Certification Prep', 'MYOB & SAGE Training', 'Excel for Accountants', 'Global Opportunity Program'].map(course => {
          const count = students.filter(s => s.course === course).length;
          const pct = students.length ? Math.round((count / students.length) * 100) : 0;
          return (
            <div key={course} className="admin-bar-row">
              <div className="admin-bar-labels">
                <span className="admin-bar-label">{course.replace(' Training', '').replace(' Prep', '')}</span>
                <span className="admin-bar-count">{count}</span>
              </div>
              <div className="admin-bar-track">
                <div className="admin-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const Submissions = ({ data, setData, token }: { data: Submission[]; setData: (d: Submission[]) => void; token: string }) => {
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [active, setActive] = useState<Submission | null>(null);

  const filtered = filter === 'all' ? data : data.filter(s => (s.status || 'new') === filter);

  const markAs = async (id: string, status: string) => {
    try {
      await fetch(`${API}/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setData(data.map(s => s._id === id ? { ...s, status } : s));
      if (active?._id === id) setActive(prev => prev ? { ...prev, status } : null);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const del = async (id: string) => {
    try {
      await fetch(`${API}/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(data.filter(s => s._id !== id));
      if (active?._id === id) setActive(null);
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <PageHeader title="Contact Submissions" sub={`${data.filter(s => (s.status || 'new') === 'new').length} unread messages`} />

      <div className="admin-filters">
        {(['all', 'new', 'read', 'replied'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`admin-filter-btn ${filter === f ? 'active' : ''}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className={`admin-sub-layout ${active ? 'with-detail' : ''}`}>
        <div className="admin-sub-list">
          {filtered.map(s => {
            const name = s.firstName ? `${s.firstName} ${s.lastName}` : 'Unknown';
            const st = s.status || 'new';
            return (
              <div key={s._id} onClick={() => setActive(s)} className={`admin-sub-item ${active?._id === s._id ? 'active' : ''}`}>
                <div>
                  <div className="admin-sub-row">
                    {st === 'new' && <span className="admin-sub-dot" />}
                    <span className={`admin-sub-name ${st === 'new' ? 'bold' : ''}`}>{name}</span>
                  </div>
                  <div className="admin-sub-meta">{s.interest} · {s.createdAt?.slice(0, 10)}</div>
                </div>
                <Badge label={st} />
              </div>
            );
          })}
        </div>

        {active && (
          <div className="admin-detail">
            <div className="admin-detail-header">
              <div>
                <h2 className="admin-detail-name">{active.firstName ? `${active.firstName} ${active.lastName}` : 'Unknown'}</h2>
                <a href={`mailto:${active.email}`} className="admin-detail-email">{active.email}</a>
              </div>
              <button onClick={() => setActive(null)} className="admin-detail-close">×</button>
            </div>
            <div className="admin-detail-chips">
              <div className="admin-detail-chip">
                <div className="admin-detail-chip-label">Interested In</div>
                <div className="admin-detail-chip-value">{active.interest}</div>
              </div>
              <div className="admin-detail-chip">
                <div className="admin-detail-chip-label">Date</div>
                <div className="admin-detail-chip-value">{active.createdAt?.slice(0, 10)}</div>
              </div>
              <div className="admin-detail-chip">
                <div className="admin-detail-chip-label">Status</div>
                <div className="admin-detail-chip-value"><Badge label={active.status || 'new'} /></div>
              </div>
            </div>
            <div className="admin-detail-message">{active.message}</div>
            <div className="admin-action-row">
              <button onClick={() => markAs(active._id, 'read')} className="admin-btn admin-btn-ghost admin-btn-md">Mark Read</button>
              <button onClick={() => markAs(active._id, 'replied')} className="admin-btn admin-btn-success admin-btn-md">Mark Replied</button>
              <a href={`mailto:${active.email}`} className="admin-btn admin-btn-danger admin-btn-md">Reply via Email</a>
              <button onClick={() => del(active._id)} className="admin-btn admin-btn-danger admin-btn-md">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Students = ({ data, setData, token }: { data: Student[]; setData: (d: Student[]) => void; token: string }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'dropped'>('all');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', course: 'QuickBooks Training', enrolled: '', status: 'active' as Student['status'] });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filtered = filter === 'all' ? data : data.filter(s => s.status === filter);

  const resetForm = () => {
    setForm({ name: '', email: '', phone: '', course: 'QuickBooks Training', enrolled: '', status: 'active' });
    setFormErrors({});
  };

  const save = async () => {
    const errs: Record<string, string> = {};
    const nErr = val.name(form.name);
    if (nErr) errs.name = nErr;
    const eErr = val.email(form.email);
    if (eErr) errs.email = eErr;
    const pErr = val.phone(form.phone);
    if (pErr) errs.phone = pErr;
    setFormErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      if (editing) {
        const res = await fetch(`${API}/students/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setData(data.map(s => s._id === editing._id ? updated : s));
        setEditing(null);
      } else {
        const res = await fetch(`${API}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setData([...data, created]);
        setAdding(false);
      }
      resetForm();
      toast.success(editing ? 'Student updated' : 'Student added');
    } catch {
      toast.error('Failed to save student');
    }
  };

  const del = async (id: string) => {
    try {
      const res = await fetch(`${API}/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setData(data.filter(s => s._id !== id));
      toast.success('Student deleted');
    } catch {
      toast.error('Failed to delete student');
    }
  };

  const toggleStatus = async (id: string, status: Student['status']) => {
    try {
      const res = await fetch(`${API}/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setData(data.map(s => s._id === id ? updated : s));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const startEdit = (s: Student) => {
    setEditing(s);
    setForm({ name: s.name, email: s.email, phone: s.phone, course: s.course, enrolled: s.enrolled, status: s.status });
    setAdding(false);
  };

  return (
    <div>
      <PageHeader
        title="Enrolled Students"
        sub={`${data.length} total · ${data.filter(s => s.status === 'active').length} active`}
        action={
          <button onClick={() => { setAdding(!adding); setEditing(null); resetForm(); }} className="admin-btn admin-btn-primary admin-btn-md">+ Add Student</button>
        }
      />

      {(adding || editing) && (
        <div className="admin-form-panel">
          <h3>{editing ? 'Edit Student' : 'New Student'}</h3>
          <div className="admin-form-grid">
            {[['Name', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'text'], ['Enrolled Date', 'enrolled', 'date']].map(([label, key, type]) => (
              <div key={key}>
                <label className="admin-label">{label}</label>
                <input type={type} value={form[key as keyof typeof form] as string} onChange={e => { setForm({ ...form, [key]: e.target.value }); setFormErrors(p => ({ ...p, [key]: '' })); }}
                  className={`admin-input ${formErrors[key] ? 'admin-input-error' : ''}`} placeholder={label} />
                {formErrors[key] && <span className="admin-field-error">{formErrors[key]}</span>}
              </div>
            ))}
            <div>
              <label className="admin-label">Course</label>
              <select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} className="admin-select">
                {['QuickBooks Training', 'Xero Certification Prep', 'MYOB & SAGE Training', 'Excel for Accountants', 'Global Opportunity Program', '1-on-1 Mentorship'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-action-row">
            <button onClick={save} className="admin-btn admin-btn-primary admin-btn-md">Save</button>
            <button onClick={() => { setAdding(false); setEditing(null); resetForm(); }} className="admin-btn admin-btn-ghost admin-btn-md">Cancel</button>
          </div>
        </div>
      )}

      <div className="admin-filters">
        {(['all', 'active', 'completed', 'dropped'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`admin-filter-btn ${filter === f ? 'active' : ''}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {['Name', 'Email', 'Course', 'Enrolled', 'Status', ''].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s._id}>
                <td className="admin-table-name">{s.name}</td>
                <td className="admin-table-email">{s.email}</td>
                <td className="admin-table-muted">{s.course}</td>
                <td className="admin-table-dim">{s.enrolled}</td>
                <td><Badge label={s.status} /></td>
                <td>
                  <div className="admin-table-actions">
                    <select value={s.status} onChange={e => toggleStatus(s._id, e.target.value as Student['status'])} className="admin-select-sm">
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="dropped">Dropped</option>
                    </select>
                    <button onClick={() => startEdit(s)} className="admin-btn admin-btn-ghost admin-btn-sm">Edit</button>
                    <button onClick={() => del(s._id)} className="admin-del-btn">×</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Testimonials = ({ data, setData, token }: { data: Testimonial[]; setData: (d: Testimonial[]) => void; token: string }) => {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: '', role: 'QuickBooks & Xero Graduate', quote: '', date: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setForm({ name: '', role: 'QuickBooks & Xero Graduate', quote: '', date: '' });
    setFormErrors({});
  };

  const save = async () => {
    const errs: Record<string, string> = {};
    const nErr = val.name(form.name);
    if (nErr) errs.name = nErr;
    if (!form.quote.trim()) errs.quote = 'Quote is required';
    else if (form.quote.trim().length < 10) errs.quote = 'Quote must be at least 10 characters';
    setFormErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      if (editing) {
        const res = await fetch(`${API}/testimonials/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setData(data.map(t => t._id === editing._id ? updated : t));
        setEditing(null);
      } else {
        const res = await fetch(`${API}/testimonials`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...form, visible: false }),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setData([...data, created]);
        setAdding(false);
      }
      resetForm();
      toast.success(editing ? 'Testimonial updated' : 'Testimonial added');
    } catch {
      toast.error('Failed to save testimonial');
    }
  };

  const toggleVisible = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`${API}/testimonials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ visible: !current }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setData(data.map(t => t._id === id ? updated : t));
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const del = async (id: string) => {
    try {
      const res = await fetch(`${API}/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setData(data.filter(t => t._id !== id));
      toast.success('Testimonial deleted');
    } catch {
      toast.error('Failed to delete testimonial');
    }
  };

  const startEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, role: t.role, quote: t.quote, date: t.date });
    setAdding(false);
  };

  return (
    <div>
      <PageHeader
        title="Testimonials"
        sub={`${data.filter(t => t.visible).length} visible on site`}
        action={<button onClick={() => { setAdding(!adding); setEditing(null); resetForm(); }} className="admin-btn admin-btn-primary admin-btn-md">+ Add</button>}
      />

      {(adding || editing) && (
        <div className="admin-form-panel">
          <h3>{editing ? 'Edit Testimonial' : 'New Testimonial'}</h3>
          <div className="admin-form-grid">
            <div>
              <label className="admin-label">Name</label>
              <input value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setFormErrors(p => ({ ...p, name: '' })); }} className={`admin-input ${formErrors.name ? 'admin-input-error' : ''}`} placeholder="Graduate name" />
              {formErrors.name && <span className="admin-field-error">{formErrors.name}</span>}
            </div>
            <div>
              <label className="admin-label">Role</label>
              <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="admin-input" />
            </div>
          </div>
          <div className="admin-mt-12">
            <label className="admin-label">Quote</label>
            <textarea value={form.quote} onChange={e => { setForm({ ...form, quote: e.target.value }); setFormErrors(p => ({ ...p, quote: '' })); }} className={`admin-textarea ${formErrors.quote ? 'admin-input-error' : ''}`} placeholder="Their testimonial..." />
            {formErrors.quote && <span className="admin-field-error">{formErrors.quote}</span>}
          </div>
          <div className="admin-action-row">
            <button onClick={save} className="admin-btn admin-btn-primary admin-btn-md">Save</button>
            <button onClick={() => { setAdding(false); setEditing(null); resetForm(); }} className="admin-btn admin-btn-ghost admin-btn-md">Cancel</button>
          </div>
        </div>
      )}

      <div className="admin-testi-grid">
        {data.map(t => (
          <div key={t._id} className={`admin-testi-card ${t.visible ? 'visible' : 'hidden'}`}>
            <div className="admin-testi-header">
              <div>
                <div className="admin-testi-name">{t.name}</div>
                <div className="admin-testi-role">{t.role}</div>
              </div>
              <Badge label={t.visible ? 'visible' : 'hidden'} />
            </div>
            <p className="admin-testi-quote">"{t.quote}"</p>
            <div className="admin-action-row">
              <button onClick={() => toggleVisible(t._id, t.visible)} className="admin-btn admin-btn-ghost admin-btn-sm">{t.visible ? 'Hide' : 'Show'}</button>
              <button onClick={() => startEdit(t)} className="admin-btn admin-btn-ghost admin-btn-sm">Edit</button>
              <button onClick={() => del(t._id)} className="admin-btn admin-btn-danger admin-btn-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Blog = ({ data, setData, token }: { data: BlogPost[]; setData: (d: BlogPost[]) => void; token: string }) => {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Career', readTime: '5 min', date: '', author: '', published: false });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setForm({ title: '', category: 'Career', readTime: '5 min', date: '', author: '', published: false });
    setFormErrors({});
  };

  const save = async () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
    setFormErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      if (editing) {
        const res = await fetch(`${API}/posts/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setData(data.map(b => b._id === editing._id ? updated : b));
        setEditing(null);
      } else {
        const res = await fetch(`${API}/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setData([...data, created]);
        setAdding(false);
      }
      resetForm();
      toast.success(editing ? 'Post updated' : 'Post created');
    } catch {
      toast.error('Failed to save post');
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`${API}/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ published: !current }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setData(data.map(b => b._id === id ? updated : b));
    } catch {
      toast.error('Failed to update publish status');
    }
  };

  const del = async (id: string) => {
    try {
      const res = await fetch(`${API}/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setData(data.filter(b => b._id !== id));
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  const startEdit = (b: BlogPost) => {
    setEditing(b);
    setForm({ title: b.title, category: b.category, readTime: b.readTime, date: b.date, author: b.author, published: b.published });
    setAdding(false);
  };

  return (
    <div>
      <PageHeader
        title="Blog Posts"
        sub={`${data.filter(b => b.published).length} published · ${data.filter(b => !b.published).length} drafts`}
        action={<button onClick={() => { setAdding(!adding); setEditing(null); resetForm(); }} className="admin-btn admin-btn-primary admin-btn-md">+ New Post</button>}
      />

      {(adding || editing) && (
        <div className="admin-form-panel">
          <h3>{editing ? 'Edit Post' : 'New Post'}</h3>
          <div>
            <label className="admin-label">Title</label>
            <input value={form.title} onChange={e => { setForm({ ...form, title: e.target.value }); setFormErrors(p => ({ ...p, title: '' })); }} className={`admin-input ${formErrors.title ? 'admin-input-error' : ''}`} placeholder="Post title..." />
            {formErrors.title && <span className="admin-field-error">{formErrors.title}</span>}
          </div>
          <div className="admin-form-grid-3 admin-mt-12">
            <div>
              <label className="admin-label">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="admin-select">
                {['Career', 'Software', 'Leadership', 'Featured', 'News'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Author</label>
              <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="admin-input" placeholder="Author name" />
            </div>
            <div>
              <label className="admin-label">Read Time</label>
              <input value={form.readTime} onChange={e => setForm({ ...form, readTime: e.target.value })} className="admin-input" placeholder="5 min" />
            </div>
          </div>
          <div className="admin-mt-12">
            <label className="admin-checkbox-row">
              <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
              Publish immediately
            </label>
          </div>
          <div className="admin-action-row">
            <button onClick={save} className="admin-btn admin-btn-primary admin-btn-md">Save</button>
            <button onClick={() => { setAdding(false); setEditing(null); }} className="admin-btn admin-btn-ghost admin-btn-md">Cancel</button>
          </div>
        </div>
      )}

      <div className="admin-blog-list">
        {data.map(b => (
          <div key={b._id} className={`admin-blog-item ${b.published ? '' : 'draft'}`}>
            <div className="admin-blog-meta">
              <div className="admin-blog-top">
                <span className="admin-tag">{b.category}</span>
                <Badge label={b.published ? 'published' : 'draft'} />
              </div>
              <div className="admin-blog-title">{b.title}</div>
              <div className="admin-blog-sub">{b.author} · {b.readTime} · {b.date}</div>
            </div>
            <div className="admin-action-row">
              <button onClick={() => togglePublish(b._id, b.published)} className="admin-btn admin-btn-ghost admin-btn-sm">{b.published ? 'Unpublish' : 'Publish'}</button>
              <button onClick={() => startEdit(b)} className="admin-btn admin-btn-ghost admin-btn-sm">Edit</button>
              <button onClick={() => del(b._id)} className="admin-btn admin-btn-danger admin-btn-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Users = ({ data }: { data: AppUser[] }) => {
  return (
    <div>
      <PageHeader title="Users" sub={`${data.length} registered accounts`} />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {['Name', 'Email', 'Role', 'Joined'].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map(u => (
              <tr key={u._id}>
                <td className="admin-table-name">{u.name}</td>
                <td className="admin-table-email">{u.email}</td>
                <td><Badge label={u.role} /></td>
                <td className="admin-table-dim">{u.createdAt?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

type Tab = 'overview' | 'submissions' | 'students' | 'testimonials' | 'blog' | 'users';

export default function AdminBody({ token }: { token: string }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [subRes, stuRes, tesRes, blogRes, usrRes] = await Promise.all([
          fetch(`${API}/contact`, { headers }),
          fetch(`${API}/students`, { headers }),
          fetch(`${API}/testimonials`, { headers }),
          fetch(`${API}/posts`, { headers }),
          fetch(`${API}/users`, { headers }),
        ]);
        if (subRes.ok) setSubmissions(await subRes.json());
        if (stuRes.ok) setStudents(await stuRes.json());
        if (tesRes.ok) setTestimonials(await tesRes.json());
        if (blogRes.ok) setBlog(await blogRes.json());
        if (usrRes.ok) setUsers(await usrRes.json());
      } catch {
        toast.error('Failed to load some data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon:
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    },
    { key: 'submissions', label: 'Submissions', icon:
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 7l-10 7L2 7" />
      </svg>
    },
    { key: 'students', label: 'Students', icon:
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" />
        <path d="M20 8l-3 3-2-2" />
      </svg>
    },
    { key: 'testimonials', label: 'Testimonials', icon:
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    },
    { key: 'blog', label: 'Blog Posts', icon:
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    },
    { key: 'users', label: 'Users', icon:
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    },
  ];

  if (loading) {
    return (
      <div className="admin-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ color: '#555' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-root">
      <div className="admin-topbar">
        <div className="admin-logo">
          <div className="admin-logo-dot">A</div>
          <span className="admin-logo-text">Aros Admin</span>
        </div>

        <div className="admin-tabs">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`admin-tab ${tab === t.key ? 'active' : ''}`}>
              {t.icon}{t.label}
              {t.key === 'submissions' && submissions.filter(s => (s.status || 'new') === 'new').length > 0 && (
                <span className="admin-tab-badge">{submissions.filter(s => (s.status || 'new') === 'new').length}</span>
              )}
            </button>
          ))}
        </div>

        <a href="/" className="admin-topbar-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to site
        </a>
      </div>

      <div className="admin-content">
        {tab === 'overview'     && <Overview submissions={submissions} students={students} testimonials={testimonials} blog={blog} />}
        {tab === 'submissions'  && <Submissions data={submissions} setData={setSubmissions} token={token} />}
        {tab === 'students'     && <Students data={students} setData={setStudents} token={token} />}
        {tab === 'testimonials' && <Testimonials data={testimonials} setData={setTestimonials} token={token} />}
        {tab === 'blog'         && <Blog data={blog} setData={setBlog} token={token} />}
        {tab === 'users'        && <Users data={users} />}
      </div>
    </div>
  );
}
