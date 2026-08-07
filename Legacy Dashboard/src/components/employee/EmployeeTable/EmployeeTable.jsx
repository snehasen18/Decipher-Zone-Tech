import React from 'react';
import { getInitials, avatarColor, formatCurrency } from '../../../utils/helpers';
import { STATUS_COLORS } from '../../../utils/constants';
import './EmployeeTable.css';

class EmployeeTable extends React.Component {
  render() {
    const { employees, onView } = this.props;

    if (!employees.length) {
      return <div className="table-empty">No employees match your search.</div>;
    }

    return (
      <div className="table-wrap">
        <table className="emp-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Email</th>
              <th>Salary</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const s = STATUS_COLORS[emp.status] || {};
              return (
                <tr key={emp.id}>
                  <td>
                    <div className="table-emp-cell">
                      <div className="table-avatar" style={{ background: avatarColor(emp.name) }}>
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <div className="table-emp-name">{emp.name}</div>
                        <div className="table-emp-role">{emp.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>{emp.department}</td>
                  <td className="table-muted">{emp.email}</td>
                  <td>{formatCurrency(emp.salary)}</td>
                  <td>
                    <span className="table-status" style={{ background: s.bg, color: s.color }}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <button className="table-view-btn" onClick={() => onView(emp.id)}>View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default EmployeeTable;