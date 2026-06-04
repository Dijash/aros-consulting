import { memo } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <h2>Navbar</h2>
      <ul>
        <li>
          <Link to="/servicepage">Service Page</Link>
        </li>
      </ul>
    </nav>
  );
};

export default memo(Navbar);