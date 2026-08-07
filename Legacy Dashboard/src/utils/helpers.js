export function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function avatarColor(name = '') {
  const colors = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx] || colors[0];
}