import React from 'react';
import Card from '../../components/common/Card/Card';
import Loader from '../../components/common/Loader/Loader';
import { fetchDashboardStats, fetchDepartmentBreakdown, fetchEmployees } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';
import './Dashboard.css';

const STAT_CONFIG = [
  { key: 'total', label: 'Total Employees', icon: '👥', color: '#4f46e5' },
  { key: 'active', label: 'Active', icon: '✅', color: '#10b981' },
  { key: 'onLeave', label: 'On Leave', icon: '🌴', color: '#f59e0b' },
  { key: 'departments', label: 'Departments', icon: '🏢', color: '#0ea5e9' },
];

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: null,
      breakdown: [],
      recentEmployees: [],
      loading: true,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadDashboardData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadDashboardData = async () => {
    const [stats, breakdown, employees] = await Promise.all([
      fetchDashboardStats(),
      fetchDepartmentBreakdown(),
      fetchEmployees(),
    ]);
    if (this._isMounted) {
      this.setState({
        stats,
        breakdown,
        recentEmployees: employees.slice(0, 5),
        loading: false,
      });
    }
  };

  render() {
    const { stats, breakdown, recentEmployees, loading } = this.state;

    if (loading) {
      return (
        <div className="page-content">
          <Loader label="Loading dashboard…" />
        </div>
      );
    }

    const maxCount = Math.max(...breakdown.map((b) => b.count));

    return (
      <div className="page-content fade-in">
        <div className="page-header">
          <div>
            <h1>Welcome back, Karan 👋</h1>
            <p>Here's what's happening across the organization today.</p>
          </div>
        </div>

        <div className="grid grid-4">
          {STAT_CONFIG.map((cfg) => (
            <Card key={cfg.key} hoverable className="stat-card">
              <div className="stat-icon" style={{ background: `${cfg.color}18`, color: cfg.color }}>
                {cfg.icon}
              </div>
              <div className="stat-value">{stats[cfg.key]}</div>
              <div className="stat-label">{cfg.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-2col" style={{ marginTop: 20 }}>
          <Card>
            <h3 className="section-title">Department Distribution</h3>
            <div className="dept-chart">
              {breakdown.map((b) => (
                <div className="dept-row" key={b.department}>
                  <span className="dept-label">{b.department}</span>
                  <div className="dept-bar-track">
                    <div
                      className="dept-bar-fill"
                      style={{ width: `${(b.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="dept-count">{b.count}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="section-title">Avg. Salary</h3>
            <div className="salary-highlight">{formatCurrency(stats.avgSalary)}</div>
            <p className="salary-sub">across all active departments</p>
            <div className="mini-divider" />
            <h3 className="section-title">Quick Snapshot</h3>
            <ul className="snapshot-list">
              <li><span>Total Headcount</span><b>{stats.total}</b></li>
              <li><span>On Leave Today</span><b>{stats.onLeave}</b></li>
              <li><span>Active Departments</span><b>{stats.departments}</b></li>
            </ul>
          </Card>
        </div>

        <Card className="recent-card" style={{ marginTop: 20 }}>
          <h3 className="section-title">Recently Added</h3>
          <div className="recent-list">
            {recentEmployees.map((emp) => {
              const s = STATUS_COLORS[emp.status] || {};
              return (
                <div className="recent-row" key={emp.id}>
                  <div>
                    <div className="recent-name">{emp.name}</div>
                    <div className="recent-role">{emp.role} · {emp.department}</div>
                  </div>
                  <span className="recent-status" style={{ background: s.bg, color: s.color }}>
                    {emp.status}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }
}

export default Dashboard;