const timeagoUnits: [number, string, string][] = [
  [60 * 60 * 24 * 365, 'year', 'years'],
  [(60 * 60 * 24 * 365) / 12, 'month', 'months'],
  [60 * 60 * 24 * 7, 'week', 'weeks'],
  [60 * 60 * 24, 'day', 'days'],
  [60 * 60, 'hour', 'hours'],
  [60, 'minute', 'minutes'],
];

export const timeago = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) {
    return 'right now';
  }

  for (const [divisor, singular, plural] of timeagoUnits) {
    if (seconds >= divisor) {
      const count = Math.floor(seconds / divisor);
      const unit = count === 1 ? singular : plural;
      return `${count} ${unit} ago`;
    }
  }

  return 'right now';
};
