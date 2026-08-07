import React from 'react';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import Pagination from '../../components/common/Pagination/Pagination';
import Loader from '../../components/common/Loader/Loader';
import Modal from '../../components/common/Modal/Modal';
import Button from '../../components/common/Button/Button';
import EmployeeCard from '../../components/employee/EmployeeCard/EmployeeCard';
import EmployeeTable from '../../components/employee/EmployeeTable/EmployeeTable';
import EmployeeDetails from '../../components/employee/EmployeeDetails/EmployeeDetails';
import { fetchEmployees } from '../../services/api';
import { DEPARTMENTS, PAGE_SIZE } from '../../utils/constants';
import './Employees.css';

class Employees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      loading: true,
      search: '',
      department: 'All',
      view: 'grid', // grid | table
      currentPage: 1,
      selectedEmployeeId: null,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadEmployees();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadEmployees = async () => {
    this.setState({ loading: true });
    const employees = await fetchEmployees();
    if (this._isMounted) this.setState({ employees, loading: false });
  };

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value, currentPage: 1 });
  };

  handleDepartmentChange = (dept) => {
    this.setState({ department: dept, currentPage: 1 });
  };

  handleViewChange = (view) => {
    this.setState({ view });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  openDetails = (id) => {
    this.setState({ selectedEmployeeId: id });
  };

  closeDetails = () => {
    this.setState({ selectedEmployeeId: null });
  };

  getFilteredEmployees() {
    const { employees, search, department } = this.state;
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.role.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());
      const matchesDept = department === 'All' || emp.department === department;
      return matchesSearch && matchesDept;
    });
  }

  render() {
    const { loading, view, currentPage, department, search, selectedEmployeeId } = this.state;
    const filtered = this.getFilteredEmployees();
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
      <div className="page-content fade-in">
        <div className="page-header">
          <div>
            <h1>Employees</h1>
            <p>{filtered.length} member{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
          <div className="view-toggle">
            <button className={view === 'grid' ? 'active' : ''} onClick={() => this.handleViewChange('grid')}>▦ Grid</button>
            <button className={view === 'table' ? 'active' : ''} onClick={() => this.handleViewChange('table')}>☰ Table</button>
          </div>
        </div>

        <div className="employees-toolbar">
          <SearchBar value={search} onChange={this.handleSearchChange} placeholder="Search by name, role, or email…" />
          <div className="dept-filters">
            {['All', ...DEPARTMENTS].map((dept) => (
              <button
                key={dept}
                className={`dept-chip ${department === dept ? 'active' : ''}`}
                onClick={() => this.handleDepartmentChange(dept)}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loader label="Fetching employees…" />
        ) : view === 'grid' ? (
          <>
            <div className="grid grid-3">
              {paginated.map((emp) => (
                <EmployeeCard key={emp.id} employee={emp} onView={this.openDetails} />
              ))}
            </div>
            {!paginated.length && <div className="no-results">No employees match your filters.</div>}
          </>
        ) : (
          <EmployeeTable employees={paginated} onView={this.openDetails} />
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={this.handlePageChange} />

        <Modal isOpen={!!selectedEmployeeId} onClose={this.closeDetails} title="Employee Profile">
          {selectedEmployeeId && (
            <EmployeeDetails employeeId={selectedEmployeeId} onClose={this.closeDetails} />
          )}
        </Modal>
      </div>
    );
  }
}

export default Employees;