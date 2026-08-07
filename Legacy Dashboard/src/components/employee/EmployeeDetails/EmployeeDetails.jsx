import React from 'react';
import { fetchEmployeeById } from '../../../services/api';
import { getInitials, avatarColor, formatCurrency, formatDate } from '../../../utils/helpers';
import { STATUS_COLORS } from '../../../utils/constants';
import Loader from '../../common/Loader/Loader';
import './EmployeeDetails.css';

// Legacy-style class component: fetches live data in componentDidMount,
// re-fetches on prop change via componentDidUpdate, cleans up in
// componentWillUnmount, and skips wasted renders via shouldComponentUpdate.
class EmployeeDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: null,
      loading: true,
      error: null,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadEmployee(this.props.employeeId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.employeeId !== this.props.employeeId) {
      this.loadEmployee(this.props.employeeId);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Avoid re-render if nothing relevant changed
    return (
      nextProps.employeeId !== this.props.employeeId ||
      nextState.loading !== this.state.loading ||
      nextState.employee !== this.state.employee ||
      nextState.error !== this.state.error
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadEmployee = async (id) => {
    this.setState({ loading: true, error: null });
    try {
      const employee = await fetchEmployeeById(id);
      if (this._isMounted) this.setState({ employee, loading: false });
    } catch (err) {
      if (this._isMounted) this.setState({ error: err.message, loading: false });
    }
  };

  render() {
    const { employee, loading, error } = this.state;
    const { onClose } = this.props;

    if (loading) return <Loader label="Fetching employee record…" />;
    if (error) return <div className="details-error">{error}</div>;
    if (!employee) return null;

    const s = STATUS_COLORS[employee.status] || {};

    return (
      <div className="emp-details">
        <div className="details-header">
          <div className="details-avatar" style={{ background: avatarColor(employee.name) }}>
            {getInitials(employee.name)}
          </div>
          <div>
            <h3>{employee.name}</h3>
            <p>{employee.role}</p>
          </div>
          <span className="details-status" style={{ background: s.bg, color: s.color }}>
            {employee.status}
          </span>
        </div>

        <div className="details-grid">
          <div className="details-item">
            <span className="dl-label">Department</span>
            <span className="dl-value">{employee.department}</span>
          </div>
          <div className="details-item">
            <span className="dl-label">Email</span>
            <span className="dl-value">{employee.email}</span>
          </div>
          <div className="details-item">
            <span className="dl-label">Location</span>
            <span className="dl-value">{employee.location}</span>
          </div>
          <div className="details-item">
            <span className="dl-label">Salary</span>
            <span className="dl-value">{formatCurrency(employee.salary)}</span>
          </div>
          <div className="details-item">
            <span className="dl-label">Joined</span>
            <span className="dl-value">{formatDate(employee.joinDate)}</span>
          </div>
        </div>

        {onClose && (
          <button className="details-close-btn" onClick={onClose}>Close</button>
        )}
      </div>
    );
  }
}

export default EmployeeDetails;
