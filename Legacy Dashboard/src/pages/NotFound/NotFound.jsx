import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

class NotFound extends React.Component {
  render() {
    return (
      <div className="notfound-wrap">
        <div className="notfound-code">404</div>
        <h2>Page not found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="notfound-btn">← Back to Dashboard</Link>
      </div>
    );
  }
}

export default NotFound;