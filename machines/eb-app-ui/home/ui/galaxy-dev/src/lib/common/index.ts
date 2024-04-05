// -----------------------------------------------------------------------------
// from epoch to "x days hh:mm:ss"
// -----------------------------------------------------------------------------
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
// The generated value will be used in the backend to set a date object.
// -----------------------------------------------------------------------------
export function today() {
  return new Date().toISOString().split("T")[0];
}

// -----------------------------------------------------------------------------
// The generated value will be used in the backend to set a date object.
// -----------------------------------------------------------------------------
export function toLocaleDate(date: string) {
  const _date = new Date(date);

  return (
    _date.getFullYear() +
    "-" +
    ("0" + (_date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + _date.getDate()).slice(-2)
  );
}

// -----------------------------------------------------------------------------
// The generated value will be used in the backend to set a time object.
// -----------------------------------------------------------------------------
export function toLocaleTime(date: string) {
  const _date = new Date(date);

  return (
    ("0" + _date.getHours()).slice(-2) +
    ":" +
    ("0" + _date.getMinutes()).slice(-2)
  );
}

// -----------------------------------------------------------------------------
// The generated value will be used in the frontend to show the user.
// -----------------------------------------------------------------------------
export function toLocaleDatetime(date: string) {
  const _date = new Date(date);

  return _date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
export function toLocaleEndTime(date: string, time: string, minutes: number) {
  const date0 = new Date(`${date}T${time}`);
  const date1 = new Date(date0.getTime() + minutes * 60 * 1000);

  return (
    ("0" + date1.getHours()).slice(-2) +
    ":" +
    ("0" + date1.getMinutes()).slice(-2)
  );
}

// -----------------------------------------------------------------------------
// to "08:30 AM - 10:00 PM"
// -----------------------------------------------------------------------------
export function toLocaleInterval(date: string, minutes: number) {
  const date0 = new Date(date);
  const date1 = new Date(date0.getTime() + minutes * 60 * 1000);
  const time0 = date0.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const time1 = date1.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${time0} - ${time1}`;
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
