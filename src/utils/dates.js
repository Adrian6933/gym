// Utilidades centralizadas de fecha (zona horaria local del dispositivo)

export function getLocalDateString(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function isSameLocalDay(tsA, tsB) {
  return getLocalDateString(new Date(tsA)) === getLocalDateString(new Date(tsB));
}

export function getMondayOfWeek(date = new Date()) {
  const currentDay = date.getDay();
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}
