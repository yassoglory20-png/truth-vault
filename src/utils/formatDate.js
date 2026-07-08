import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date, formatStr = 'MMMM d, yyyy') {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr);
}

export function formatRelative(date) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDateTime(date) {
  return formatDate(date, 'MMMM d, yyyy h:mm a');
}
