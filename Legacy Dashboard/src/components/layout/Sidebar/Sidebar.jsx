import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/employees', label: 'Employees', icon: '👥' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/profile', label: 'Profile', icon: '🙍' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

class Sidebar extends React.Component {
  render() {
    const { isOpen, onClose } = this.props;
    return (
      <>
        <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
          <div className="sidebar-brand">
            <div className="brand-mark">N</div>
            <div>
              <div className="brand-title">Nexus HR</div>
              <div className="brand-sub">Enterprise Suite</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer-card">
            <p className="sfc-title">Refactor Sprint</p>
            <p className="sfc-text">Class components + lifecycle methods, live data fetch on mount.</p>
          </div>
        </aside>
      </>
    );
  }
}

export default Sidebar;
