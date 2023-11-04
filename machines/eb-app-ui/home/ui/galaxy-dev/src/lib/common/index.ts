export function epochToIntervalString(time: number) {
  try {
    let sign = "";

    if (time < 0) {
      sign = "-";
      time = -1 * time;
    }

    const day = Math.trunc(time / 86400);
    let remainder = time % 86400;

    const hour = Math.trunc(remainder / 3600);
    remainder = remainder % 3600;

    const min = Math.trunc(remainder / 60);
    const sec = Math.trunc(remainder % 60);

    let interval = sign;

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

// -----------------------------------------------------------------------------
// if the time difference is less than 15 min then accept it as online
// -----------------------------------------------------------------------------
export function isOnline(date: string) {
  const _date = new Date(date);
  const now = new Date();
  const diff = _date.getTime() - now.getTime();

  return diff < 15 * 60 * 1000;
}

// -----------------------------------------------------------------------------
export function isToday(date: string) {
  const _date = new Date(date);
  const today = new Date();

  return (
    _date.getFullYear() === today.getFullYear() &&
    _date.getMonth() === today.getMonth() &&
    _date.getDate() === today.getDate()
  );
}
