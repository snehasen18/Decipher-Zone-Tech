import React from 'react';
import Card from '../../common/Card/Card';
import { getInitials, avatarColor } from '../../../utils/helpers';
import { STATUS_COLORS } from '../../../utils/constants';
import './EmployeeCard.css';

class EmployeeCard extends React.Component {
  render() {
    const { employee, onView } = this.props;
    const statusStyle = STATUS_COLORS[employee.status] || {};

    return (
      <Card hoverable className="emp-card">
        <div className="emp-card-top">
          <div className="emp-avatar" style={{ background: avatarColor(employee.name) }}>
            {getInitials(employee.name)}
          </div>
          <span
            className="emp-status"
            style={{ background: statusStyle.bg, color: statusStyle.color }}
          >
            {employee.status}
          </span>
        </div>
        <h4 className="emp-name">{employee.name}</h4>
        <p className="emp-role">{employee.role}</p>
        <div className="emp-meta">
          <span>🏢 {employee.department}</span>
          <span>📍 {employee.location}</span>
        </div>
        <button className="emp-view-btn" onClick={() => onView(employee.id)}>
          View Details →
        </button>
      </Card>
    );
  }
}

export default EmployeeCard;