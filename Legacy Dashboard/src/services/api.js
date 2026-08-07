import employees from '../data/employees';

// Simulated API layer — mimics real network latency so lifecycle methods
// like componentDidMount have something meaningful to demonstrate.

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchEmployees() {
  await delay(700);
  return [...employees];
}

export async function fetchEmployeeById(id) {
  await delay(500);
  const found = employees.find((e) => e.id === Number(id));
  if (!found) throw new Error('Employee not found');
  return found;
}

export async function fetchDashboardStats() {
  await delay(600);
  const total = employees.length;
  const active = employees.filter((e) => e.status === 'Active').length;
  const onLeave = employees.filter((e) => e.status === 'On Leave').length;
  const departments = new Set(employees.map((e) => e.department)).size;
  const avgSalary = Math.round(employees.reduce((s, e) => s + e.salary, 0) / total);
  return { total, active, onLeave, departments, avgSalary };
}

export async function fetchDepartmentBreakdown() {
  await delay(650);
  const map = {};
  employees.forEach((e) => {
    map[e.department] = (map[e.department] || 0) + 1;
  });
  return Object.entries(map).map(([department, count]) => ({ department, count }));
}