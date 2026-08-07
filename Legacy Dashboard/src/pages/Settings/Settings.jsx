import React from 'react';
import Card from '../../components/common/Card/Card';
import './Settings.css';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAlerts: true,
      weeklyDigest: false,
      darkMode: false,
      twoFactor: true,
    };
  }

  toggle = (key) => () => {
    this.setState((prev) => ({ [key]: !prev[key] }));
  };

  render() {
    const { emailAlerts, weeklyDigest, darkMode, twoFactor } = this.state;
    const rows = [
      { key: 'emailAlerts', label: 'Email Alerts', desc: 'Get notified about important employee updates.', value: emailAlerts },
      { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Receive a summary every Monday morning.', value: weeklyDigest },
      { key: 'darkMode', label: 'Dark Mode', desc: 'Switch to a darker interface theme.', value: darkMode },
      { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account.', value: twoFactor },
    ];

    return (
      <div className="page-content fade-in">
        <div className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Configure your workspace preferences.</p>
          </div>
        </div>

        <Card>
          <div className="settings-list">
            {rows.map((row) => (
              <div className="settings-row" key={row.key}>
                <div>
                  <div className="settings-label">{row.label}</div>
                  <div className="settings-desc">{row.desc}</div>
                </div>
                <button
                  className={`toggle-switch ${row.value ? 'on' : ''}`}
                  onClick={this.toggle(row.key)}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }
}

export default Settings;