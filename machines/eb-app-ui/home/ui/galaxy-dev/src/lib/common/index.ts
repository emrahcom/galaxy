export function toLocaleTime(date: string) {
  const _date = new Date(date);

  return _date.toLocaleString();
}

// -----------------------------------------------------------------------------
export function toInputTime(date: string) {
  let _time1 = new Date();

  if (date) {
    _time1 = new Date(date);
  }

  const _time2 = new Date(
    _time1.getTime() - 60 * 1000 * _time1.getTimezoneOffset(),
  );

  return _time2.toISOString().slice(0, 16);
}
