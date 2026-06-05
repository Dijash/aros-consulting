import { useState } from 'react';
import './Admin.css'

/* ─── Shared types ─── */
type Submission = {
  id: number; name: string; email: string;
  interest: string; message: string; date: string; status: 'new' | 'read' | 'replied';
};
type Student = {
  id: number; name: string; email: string; phone: string;
  course: string; enrolled: string; status: 'active' | 'completed' | 'dropped';
};
type Testimonial = {
  id: number; name: string; role: string; quote: string;
  visible: boolean; date: string;
};
type BlogPost = {
  id: number; title: string; category: string;
  readTime: string; date: string; published: boolean; author: string;
};

/* ─── Seed data ─── */
const initSubmissions: Submission[] = [
  { id: 1, name: 'Rajesh Sharma', email: 'rajesh@gmail.com', interest: 'QuickBooks Training', message: 'I want to enroll in the next batch. Please let me know the schedule.', date: '2025-05-20', status: 'new' },
  { id: 2, name: 'Priya Thapa', email: 'priya@yahoo.com', interest: 'Xero Certification Prep', message: 'I have 2 years of accounting experience and want to get Xero certified.', date: '2025-05-18', status: 'read' },
  { id: 3, name: 'Arjun KC', email: 'arjun@outlook.com', interest: 'Global Opportunity Program', message: 'Looking for placement help in Australia. Currently CPA qualified.', date: '2025-05-15', status: 'replied' },
  { id: 4, name: 'Sunita Rai', email: 'sunita@gmail.com', interest: 'Excel for Accountants', message: 'Want to improve my Excel skills for better job prospects.', date: '2025-05-12', status: 'new' },
  { id: 5, name: 'Bishal Gurung', email: 'bishal@gmail.com', interest: '1-on-1 Mentorship', message: 'Need personalized guidance to transition into cloud accounting.', date: '2025-05-10', status: 'replied' },
];

const initStudents: Student[] = [
  { id: 1, name: 'Bibek Prasad Kushwaha', email: 'bibek@gmail.com', phone: '+977 9801234567', course: 'QuickBooks Training', enrolled: '2025-04-01', status: 'completed' },
  { id: 2, name: 'Pabitra Budhathoki', email: 'pabitra@gmail.com', phone: '+977 9807654321', course: 'Xero Certification Prep', enrolled: '2025-04-15', status: 'active' },
  { id: 3, name: 'Nisha Shrestha', email: 'nisha@gmail.com', phone: '+977 9812345678', course: 'QuickBooks Training', enrolled: '2025-04-01', status: 'completed' },
  { id: 4, name: 'Sanjay Limbu', email: 'sanjay@gmail.com', phone: '+977 9876543210', course: 'MYOB & SAGE Training', enrolled: '2025-05-01', status: 'active' },
  { id: 5, name: 'Anjali Tamang', email: 'anjali@gmail.com', phone: '+977 9823456789', course: 'Excel for Accountants', enrolled: '2025-05-10', status: 'active' },
  { id: 6, name: 'Dipesh Karki', email: 'dipesh@gmail.com', phone: '+977 9834567890', course: 'Global Opportunity Program', enrolled: '2025-03-20', status: 'dropped' },
];

const initTestimonials: Testimonial[] = [
  { id: 1, name: 'Bibek Prasad Kushwaha', role: 'QuickBooks & Xero Graduate', quote: 'The training was excellent. The trainer as well as the team were very supportive... I feel more confident in using cloud accounting software.', visible: true, date: '2025-04-10' },
  { id: 2, name: 'Pabitra Kumari Budhathoki', role: 'QuickBooks & Xero Graduate', quote: 'Each and everyone of you were dedicated and there for us to clear our doubts whenever needed. It was incredible to learn about QuickBooks & Xero.', visible: true, date: '2025-04-10' },
  { id: 3, name: 'Nisha Shrestha', role: 'QuickBooks & Xero Graduate', quote: 'The trainer is very calm and clarify every doubts come during the training. The practical, hands-on sessions were great.', visible: true, date: '2025-04-10' },
  { id: 4, name: 'Ramesh Adhikari', role: 'Xero Graduate', quote: 'This course completely changed my career trajectory. Highly recommended for anyone serious about global accounting.', visible: false, date: '2025-05-01' },
];

const initBlog: BlogPost[] = [
  { id: 1, title: 'How Nepali Accountants Can Land Remote Jobs in Australia and the UK in 2025', category: 'Featured', readTime: '8 min', date: '2025-04-15', published: true, author: 'Aros Octa Team' },
  { id: 2, title: 'QuickBooks vs Xero: Which Should You Learn First?', category: 'Software', readTime: '5 min', date: '2025-03-28', published: true, author: 'CA. Deepak Thapa' },
  { id: 3, title: '5 CV Mistakes Nepali Accountants Make When Applying Abroad', category: 'Career', readTime: '6 min', date: '2025-03-10', published: true, author: 'Aros Octa Team' },
  { id: 4, title: 'Why Communication Skills Are the Hidden Key to Global Accounting Careers', category: 'Leadership', readTime: '4 min', date: '2025-02-22', published: false, author: 'Ujjwal Chaudhary' },
];

/* ─── Helpers ─── */
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

/* ─── OVERVIEW ─── */
const Overview = ({ submissions, students, testimonials, blog }: {
  submissions: Submission[]; students: Student[];
  testimonials: Testimonial[]; blog: BlogPost[];
}) => (
    <div>
    <PageHeader title="Overview" sub="Welcome back — here's what's happening." />
    <div className="admin-stats-grid">
      <Stat label="Total Submissions" value={submissions.length} accent />
      <Stat label="New Unread" value={submissions.filter(s => s.status === 'new').length} />
      <Stat label="Total Students" value={students.length} />
      <Stat label="Active Students" value={students.filter(s => s.status === 'active').length} />
      <Stat label="Published Posts" value={blog.filter(b => b.published).length} />
      <Stat label="Visible Testimonials" value={testimonials.filter(t => t.visible).length} />
    </div>

    <div className="admin-two-col">
      {/* Recent submissions */}
      <div className="admin-card">
        <h3 className="admin-card-title">Recent Submissions</h3>
        {submissions.slice(0, 4).map(s => (
          <div key={s.id} className="admin-overview-row">
            <div>
              <div className="admin-overview-name">{s.name}</div>
              <div className="admin-overview-sub">{s.interest}</div>
            </div>
            <Badge label={s.status} />
          </div>
        ))}
      </div>

      {/* Students by course */}
      <div className="admin-card">
        <h3 className="admin-card-title">Students by Course</h3>
        {['QuickBooks Training', 'Xero Certification Prep', 'MYOB & SAGE Training', 'Excel for Accountants', 'Global Opportunity Program'].map(course => {
          const count = students.filter(s => s.course === course).length;
          const pct = Math.round((count / students.length) * 100);
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

/* ─── SUBMISSIONS ─── */
const Submissions = ({ data, setData }: { data: Submission[]; setData: (d: Submission[]) => void }) => {
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [active, setActive] = useState<Submission | null>(null);

  const filtered = filter === 'all' ? data : data.filter(s => s.status === filter);

  const markAs = (id: number, status: Submission['status']) => {
    setData(data.map(s => s.id === id ? { ...s, status } : s));
    if (active?.id === id) setActive(prev => prev ? { ...prev, status } : null);
  };

  const del = (id: number) => {
    setData(data.filter(s => s.id !== id));
    if (active?.id === id) setActive(null);
  };

  return (
    <div>
      <PageHeader title="Contact Submissions" sub={`${data.filter(s => s.status === 'new').length} unread messages`} />

      {/* Filter tabs */}
      <div className="admin-filters">
        {(['all', 'new', 'read', 'replied'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`admin-filter-btn ${filter === f ? 'active' : ''}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className={`admin-sub-layout ${active ? 'with-detail' : ''}`}>
        {/* List */}
        <div className="admin-sub-list">
          {filtered.map(s => (
            <div key={s.id} onClick={() => setActive(s)} className={`admin-sub-item ${active?.id === s.id ? 'active' : ''}`}>
              <div>
                <div className="admin-sub-row">
                  {s.status === 'new' && <span className="admin-sub-dot" />}
                  <span className={`admin-sub-name ${s.status === 'new' ? 'bold' : ''}`}>{s.name}</span>
                </div>
                <div className="admin-sub-meta">{s.interest} · {s.date}</div>
              </div>
              <Badge label={s.status} />
            </div>
          ))}
        </div>

        {/* Detail */}
        {active && (
          <div className="admin-detail">
            <div className="admin-detail-header">
              <div>
                <h2 className="admin-detail-name">{active.name}</h2>
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
                <div className="admin-detail-chip-value">{active.date}</div>
              </div>
              <div className="admin-detail-chip">
                <div className="admin-detail-chip-label">Status</div>
                <div className="admin-detail-chip-value"><Badge label={active.status} /></div>
              </div>
            </div>
            <div className="admin-detail-message">{active.message}</div>
            <div className="admin-action-row">
              <button onClick={() => markAs(active.id, 'read')} className="admin-btn admin-btn-ghost admin-btn-md">Mark Read</button>
              <button onClick={() => markAs(active.id, 'replied')} className="admin-btn admin-btn-success admin-btn-md">Mark Replied</button>
              <a href={`mailto:${active.email}`} className="admin-btn admin-btn-danger admin-btn-md">Reply via Email</a>
              <button onClick={() => del(active.id)} className="admin-btn admin-btn-danger admin-btn-md">Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── STUDENTS ─── */
const Students = ({ data, setData }: { data: Student[]; setData: (d: Student[]) => void }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'dropped'>('all');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', course: 'QuickBooks Training', enrolled: '', status: 'active' as Student['status'] });

  const filtered = filter === 'all' ? data : data.filter(s => s.status === filter);

  const add = () => {
    if (!form.name || !form.email) return;
    setData([...data, { ...form, id: Date.now() }]);
    setAdding(false);
    setForm({ name: '', email: '', phone: '', course: 'QuickBooks Training', enrolled: '', status: 'active' });
  };

  const del = (id: number) => setData(data.filter(s => s.id !== id));
  const toggle = (id: number, status: Student['status']) => setData(data.map(s => s.id === id ? { ...s, status } : s));

  return (
    <div>
      <PageHeader
        title="Enrolled Students"
        sub={`${data.length} total · ${data.filter(s => s.status === 'active').length} active`}
        action={
          <button onClick={() => setAdding(!adding)} className="admin-btn admin-btn-primary admin-btn-md">+ Add Student</button>
        }
      />

      {/* Add form */}
      {adding && (
        <div className="admin-form-panel">
          <h3>New Student</h3>
          <div className="admin-form-grid">
            {[['Name', 'name', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'text'], ['Enrolled Date', 'enrolled', 'date']].map(([label, key, type]) => (
              <div key={key}>
                <label className="admin-label">{label}</label>
                <input type={type} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="admin-input" placeholder={label as string} />
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
            <button onClick={add} className="admin-btn admin-btn-primary admin-btn-md">Save</button>
            <button onClick={() => setAdding(false)} className="admin-btn admin-btn-ghost admin-btn-md">Cancel</button>
          </div>
        </div>
      )}

      {/* Filter */}
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
              <tr key={s.id}>
                <td className="admin-table-name">{s.name}</td>
                <td className="admin-table-email">{s.email}</td>
                <td className="admin-table-muted">{s.course}</td>
                <td className="admin-table-dim">{s.enrolled}</td>
                <td><Badge label={s.status} /></td>
                <td>
                  <div className="admin-table-actions">
                    <select value={s.status} onChange={e => toggle(s.id, e.target.value as Student['status'])} className="admin-select-sm">
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="dropped">Dropped</option>
                    </select>
                    <button onClick={() => del(s.id)} className="admin-del-btn">×</button>
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

/* ─── TESTIMONIALS ─── */
const Testimonials = ({ data, setData }: { data: Testimonial[]; setData: (d: Testimonial[]) => void }) => {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: '', role: 'QuickBooks & Xero Graduate', quote: '', date: '' });

  const save = () => {
    if (!form.name || !form.quote) return;
    if (editing) {
      setData(data.map(t => t.id === editing.id ? { ...editing, ...form } : t));
      setEditing(null);
    } else {
      setData([...data, { ...form, id: Date.now(), visible: false }]);
      setAdding(false);
    }
    setForm({ name: '', role: 'QuickBooks & Xero Graduate', quote: '', date: '' });
  };

  const toggleVisible = (id: number) => setData(data.map(t => t.id === id ? { ...t, visible: !t.visible } : t));
  const del = (id: number) => setData(data.filter(t => t.id !== id));

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
        action={<button onClick={() => { setAdding(!adding); setEditing(null); }} className="admin-btn admin-btn-primary admin-btn-md">+ Add</button>}
      />

      {(adding || editing) && (
        <div className="admin-form-panel">
          <h3>{editing ? 'Edit Testimonial' : 'New Testimonial'}</h3>
          <div className="admin-form-grid">
            <div>
              <label className="admin-label">Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="admin-input" placeholder="Graduate name" />
            </div>
            <div>
              <label className="admin-label">Role</label>
              <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="admin-input" />
            </div>
          </div>
          <div className="admin-mt-12">
            <label className="admin-label">Quote</label>
            <textarea value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} className="admin-textarea" placeholder="Their testimonial..." />
          </div>
          <div className="admin-action-row">
            <button onClick={save} className="admin-btn admin-btn-primary admin-btn-md">Save</button>
            <button onClick={() => { setAdding(false); setEditing(null); }} className="admin-btn admin-btn-ghost admin-btn-md">Cancel</button>
          </div>
        </div>
      )}

      <div className="admin-testi-grid">
        {data.map(t => (
          <div key={t.id} className={`admin-testi-card ${t.visible ? 'visible' : 'hidden'}`}>
            <div className="admin-testi-header">
              <div>
                <div className="admin-testi-name">{t.name}</div>
                <div className="admin-testi-role">{t.role}</div>
              </div>
              <Badge label={t.visible ? 'visible' : 'hidden'} />
            </div>
            <p className="admin-testi-quote">"{t.quote}"</p>
            <div className="admin-action-row">
              <button onClick={() => toggleVisible(t.id)} className="admin-btn admin-btn-ghost admin-btn-sm">{t.visible ? 'Hide' : 'Show'}</button>
              <button onClick={() => startEdit(t)} className="admin-btn admin-btn-ghost admin-btn-sm">Edit</button>
              <button onClick={() => del(t.id)} className="admin-btn admin-btn-danger admin-btn-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── BLOG ─── */
const Blog = ({ data, setData }: { data: BlogPost[]; setData: (d: BlogPost[]) => void }) => {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Career', readTime: '5 min', date: '', author: '', published: false });

  const save = () => {
    if (!form.title) return;
    if (editing) {
      setData(data.map(b => b.id === editing.id ? { ...editing, ...form } : b));
      setEditing(null);
    } else {
      setData([...data, { ...form, id: Date.now() }]);
      setAdding(false);
    }
    setForm({ title: '', category: 'Career', readTime: '5 min', date: '', author: '', published: false });
  };

  const togglePublish = (id: number) => setData(data.map(b => b.id === id ? { ...b, published: !b.published } : b));
  const del = (id: number) => setData(data.filter(b => b.id !== id));

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
        action={<button onClick={() => { setAdding(!adding); setEditing(null); }} className="admin-btn admin-btn-primary admin-btn-md">+ New Post</button>}
      />

      {(adding || editing) && (
        <div className="admin-form-panel">
          <h3>{editing ? 'Edit Post' : 'New Post'}</h3>
          <div>
            <label className="admin-label">Title</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="admin-input" placeholder="Post title..." />
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
          <div key={b.id} className={`admin-blog-item ${b.published ? '' : 'draft'}`}>
            <div className="admin-blog-meta">
              <div className="admin-blog-top">
                <span className="admin-pill">{b.category}</span>
                <Badge label={b.published ? 'published' : 'draft'} />
              </div>
              <div className="admin-blog-title">{b.title}</div>
              <div className="admin-blog-sub">{b.author} · {b.readTime} · {b.date}</div>
            </div>
            <div className="admin-action-row">
              <button onClick={() => togglePublish(b.id)} className="admin-btn admin-btn-ghost admin-btn-sm">{b.published ? 'Unpublish' : 'Publish'}</button>
              <button onClick={() => startEdit(b)} className="admin-btn admin-btn-ghost admin-btn-sm">Edit</button>
              <button onClick={() => del(b.id)} className="admin-btn admin-btn-danger admin-btn-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Styles are provided by Admin.css; inline style helpers removed. */

/* ─── Main body with tab routing ─── */
type Tab = 'overview' | 'submissions' | 'students' | 'testimonials' | 'blog';

export default function AdminBody() {
  const [tab, setTab] = useState<Tab>('overview');
  const [submissions, setSubmissions] = useState<Submission[]>(initSubmissions);
  const [students, setStudents] = useState<Student[]>(initStudents);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initTestimonials);
  const [blog, setBlog] = useState<BlogPost[]>(initBlog);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'submissions', label: 'Submissions', icon: '📬' },
    { key: 'students', label: 'Students', icon: '🎓' },
    { key: 'testimonials', label: 'Testimonials', icon: '💬' },
    { key: 'blog', label: 'Blog Posts', icon: '📝' },
  ];

  return (
    <div className="admin-root">
      {/* Top bar */}
      <div className="admin-topbar">
        {/* Logo */}
        <div className="admin-logo">
          <div className="admin-logo-dot">A</div>
          <span className="admin-logo-text">Aros Admin</span>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`admin-tab ${tab === t.key ? 'active' : ''}`}>
              <span>{t.icon}</span>{t.label}
              {t.key === 'submissions' && submissions.filter(s => s.status === 'new').length > 0 && (
                <span className="admin-tab-badge">{submissions.filter(s => s.status === 'new').length}</span>
              )}
            </button>
          ))}
        </div>

        <a href="/" className="admin-topbar-back">← Back to site</a>
      </div>

      {/* Content */}
      <div className="admin-content">
        {tab === 'overview'     && <Overview submissions={submissions} students={students} testimonials={testimonials} blog={blog} />}
        {tab === 'submissions'  && <Submissions data={submissions} setData={setSubmissions} />}
        {tab === 'students'     && <Students data={students} setData={setStudents} />}
        {tab === 'testimonials' && <Testimonials data={testimonials} setData={setTestimonials} />}
        {tab === 'blog'         && <Blog data={blog} setData={setBlog} />}
      </div>
    </div>
  );
}