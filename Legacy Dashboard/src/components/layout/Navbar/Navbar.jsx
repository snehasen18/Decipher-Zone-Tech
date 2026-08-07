import React from 'react';
import './Navbar.css';

class Navbar extends React.Component {
  render() {
    const { onMenuClick, pageTitle = 'Dashboard' } = this.props;
    return (
      <header className="navbar">
        <div className="navbar-left">
          <button className="menu-toggle" onClick={onMenuClick}>☰</button>
          <span className="navbar-title">{pageTitle}</span>
        </div>
        <div className="navbar-right">
          <button className="icon-btn" title="Notifications">
            🔔
            <span className="notif-dot" />
          </button>
          <div className="navbar-user">
            <div className="user-avatar">KP</div>
            <div className="user-meta">
              <div className="user-name">Karan P.</div>
              <div className="user-role">CEO</div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Navbar;