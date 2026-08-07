import React from 'react';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import './Profile.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Karan P.',
      email: 'karan.p@company.com',
      role: 'Chief Executive Officer',
      saved: false,
    };
  }

  handleChange = (field) => (e) => {
    this.setState({ [field]: e.target.value, saved: false });
  };

  handleSave = () => {
    this.setState({ saved: true });
    setTimeout(() => this.setState({ saved: false }), 2200);
  };

  render() {
    const { name, email, role, saved } = this.state;
    return (
      <div className="page-content fade-in">
        <div className="page-header">
          <div>
            <h1>Profile</h1>
            <p>Manage your personal information.</p>
          </div>
        </div>

        <div className="grid grid-2col">
          <Card>
            <div className="profile-avatar-block">
              <div className="profile-avatar">{name.split(' ').map((n) => n[0]).join('')}</div>
              <div>
                <h3>{name}</h3>
                <p>{role}</p>
              </div>
            </div>

            <div className="profile-form">
              <Input label="Full Name" value={name} onChange={this.handleChange('name')} />
              <Input label="Email" type="email" value={email} onChange={this.handleChange('email')} />
              <Input label="Role" value={role} onChange={this.handleChange('role')} />
              <Button onClick={this.handleSave}>{saved ? '✓ Saved' : 'Save Changes'}</Button>
            </div>
          </Card>

          <Card>
            <h3 className="section-title">Account Summary</h3>
            <ul className="summary-list">
              <li><span>Access Level</span><b>Administrator</b></li>
              <li><span>Member Since</span><b>Jan 2019</b></li>
              <li><span>Last Login</span><b>Today, 9:42 AM</b></li>
            </ul>
          </Card>
        </div>
      </div>
    );
  }
}

export default Profile;