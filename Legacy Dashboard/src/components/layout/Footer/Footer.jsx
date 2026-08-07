import React from 'react';
import './Footer.css';

class Footer extends React.Component {
  render() {
    return (
      <footer className="app-footer">
        <span>© {new Date().getFullYear()} Nexus HR — Internal Employee Management</span>
        <span className="footer-tag">Built with React Class Components</span>
      </footer>
    );
  }
}

export default Footer;