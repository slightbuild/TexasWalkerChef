const DATE_DIGITS = 8;
const MIN_LEAD_DAYS = 14;

export function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, DATE_DIGITS);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function parseEventDate(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;

  const month = Number(match[1]);
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function earliestEventDate(from = new Date()): Date {
  const date = new Date(from);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + MIN_LEAD_DAYS);
  return date;
}

export function formatMMDDYYYY(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}/${date.getFullYear()}`;
}

export function validateEventDate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Please enter an event date at least 2 weeks from today.';
  }

  const parsed = parseEventDate(trimmed);
  if (!parsed) {
    return 'Please enter the event date as MM/DD/YYYY.';
  }

  const earliest = earliestEventDate();
  if (parsed < earliest) {
    return `Event date must be at least 2 weeks out. Earliest date is ${formatMMDDYYYY(earliest)}.`;
  }

  return null;
}
