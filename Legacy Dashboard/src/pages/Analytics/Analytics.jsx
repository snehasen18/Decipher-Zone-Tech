import React from 'react';
import Card from '../../components/common/Card/Card';
import Loader from '../../components/common/Loader/Loader';
import { fetchEmployees, fetchDepartmentBreakdown } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import './Analytics.css';

class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = { employees: [], breakdown: [], loading: true };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadData = async () => {
    const [employees, breakdown] = await Promise.all([fetchEmployees(), fetchDepartmentBreakdown()]);
    if (this._isMounted) this.setState({ employees, breakdown, loading: false });
  };

  render() {
    const { employees, breakdown, loading } = this.state;
    if (loading) return <div className="page-content"><Loader label="Crunching numbers…" /></div>;

    const byDept = {};
    employees.forEach((e) => {
      if (!byDept[e.department]) byDept[e.department] = [];
      byDept[e.department].push(e.salary);
    });

    const maxCount = Math.max(...breakdown.map((b) => b.count));

    return (
      <div className="page-content fade-in">
        <div className="page-header">
          <div>
            <h1>Analytics</h1>
            <p>Workforce distribution and compensation insights.</p>
          </div>
        </div>

        <div className="grid grid-2col">
          <Card>
            <h3 className="section-title">Headcount by Department</h3>
            <div className="bar-chart">
              {breakdown.map((b) => (
                <div className="bar-col" key={b.department}>
                  <div className="bar-shell">
                    <div className="bar-fill" style={{ height: `${(b.count / maxCount) * 100}%` }} />
                  </div>
                  <span className="bar-count">{b.count}</span>
                  <span className="bar-label">{b.department}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="section-title">Avg Salary by Department</h3>
            <div className="salary-list">
              {Object.entries(byDept).map(([dept, salaries]) => {
                const avg = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
                return (
                  <div className="salary-row" key={dept}>
                    <span>{dept}</span>
                    <b>{formatCurrency(avg)}</b>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

export default Analytics;