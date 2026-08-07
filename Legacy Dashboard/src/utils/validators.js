export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isNotEmpty(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}