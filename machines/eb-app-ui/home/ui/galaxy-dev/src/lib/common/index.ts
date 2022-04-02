export function epochToIntervalString(time: number) {
  try {
    const day = Math.floor(time / 86400);
    let remainder = time % 86400;

    const hour = Math.floor(remainder / 3600);
    remainder = remainder % 3600;

    const min = Math.floor(remainder / 60);
    const sec = remainder % 60;

    let interval = "";

    if (day > 1) {
      interval = `${day} days`;
    } else if (day === 1) {
      interval = `${day} day`;
    }

    interval = `${interval} ${String(hour).padStart(2, "0")}`;
    interval = `${interval}:${String(min).padStart(2, "0")}`;
    interval = `${interval}:${String(sec).padStart(2, "0")}`;

    return interval;
  } catch {
    return "";
  }
}

// -----------------------------------------------------------------------------
export function toInputTime(date = "") {
  let _time1 = new Date();

  if (date) _time1 = new Date(date);

  const _time2 = new Date(
    _time1.getTime() - 60 * 1000 * _time1.getTimezoneOffset(),
  );

  return _time2.toISOString().slice(0, 16);
}

// -----------------------------------------------------------------------------
export function toLocaleTime(date: string) {
  const _date = new Date(date);

  return _date.toLocaleString();
}
