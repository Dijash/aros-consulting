import { memo } from 'react';

const Footer = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-brand-name">Aros <span>Octa</span> Consulting</div>
          <p>Empowering Nepali accounting professionals with the skills and connections to thrive in global markets.</p>
          <div className="footer-tagline">"We grow when our people grow"</div>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            {['QuickBooks Training','Xero Certification','Global Opportunity','MYOB & SAGE','1-on-1 Mentorship'].map(s => (
              <li key={s}><a href="#services" onClick={e => { e.preventDefault(); scrollTo('services'); }}>{s}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            {[['about','About Us'],['mentors','Our Mentors'],['blog','Blog & Resources'],['contact','Contact Us']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>{label}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <ul>
            {['LinkedIn','Facebook','Instagram','YouTube'].map(s => (
              <li key={s}><a href="#">{s}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Aros Octa Consulting. All rights reserved.</p>
        <p>Built with <em>precision</em> for Nepal's accounting community</p>
      </div>
    </footer>
  );
};

export default memo(Footer);