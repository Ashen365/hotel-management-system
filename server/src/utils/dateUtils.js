const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Coerce any input to LOCAL midnight.
// Important: a plain "YYYY-MM-DD" string is parsed by JS as UTC midnight,
// which silently shifts the date by the offset (negative for e.g. +05:30).
const toLocalMidnight = (input) => {
  const str = String(input).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const date = new Date(str);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Whole nights between two local-midnight dates (minimum 1).
const nightsBetween = (checkIn, checkOut) => Math.round((checkOut - checkIn) / MS_PER_DAY);

module.exports = { toLocalMidnight, nightsBetween, MS_PER_DAY };