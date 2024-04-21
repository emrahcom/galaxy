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
// The generated value will be used in the backend to set a date string.
// YYYY-MM-DD
// -----------------------------------------------------------------------------
export function today() {
  const now = new Date();

  return (
    now.getFullYear() +
    "-" +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + now.getDate()).slice(-2)
  );
}

// -----------------------------------------------------------------------------
// The generated value will be used in the backend to set a date string.
// YYYY-MM-DD
// -----------------------------------------------------------------------------
export function dateAfterXDays(days: number) {
  const now = new Date();

  const date = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  if (isNaN(date.getTime())) throw new Error("invalid date");

  return (
    date.getFullYear() +
    "-" +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2)
  );
}

// -----------------------------------------------------------------------------
// The generated value will be used in the backend to set a date string.
// Saturday is assumed as the last day of the week.
// YYYY-MM-DD
// -----------------------------------------------------------------------------
export function lastDayOfWeek(date: string) {
  const _date = new Date(date);
  if (isNaN(_date.getTime())) throw new Error("invalid date");

  const diff = 6 - _date.getDay();
  const saturday = new Date(_date.getTime() + diff * 24 * 60 * 60 * 1000);

  return (
    saturday.getFullYear() +
    "-" +
    ("0" + (saturday.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + saturday.getDate()).slice(-2)
  );
}

// -----------------------------------------------------------------------------
// The generated value will be used in the backend to set a date string.
// YYYY-MM-DD
// -----------------------------------------------------------------------------
export function toLocaleDate(date: string) {
  const _date = new Date(date);
  if (isNaN(_date.getTime())) throw new Error("invalid date");

  return (
    _date.getFullYear() +
    "-" +
    ("0" + (_date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + _date.getDate()).slice(-2)
  );
}

// -----------------------------------------------------------------------------
// The generated value will be used in the backend to set a time string.
// HH:MM
// -----------------------------------------------------------------------------
export function toLocaleTime(date: string) {
  const _date = new Date(date);
  if (isNaN(_date.getTime())) throw new Error("invalid date");

  return (
    ("0" + _date.getHours()).slice(-2) +
    ":" +
    ("0" + _date.getMinutes()).slice(-2)
  );
}

// -----------------------------------------------------------------------------
// The generated value will be used in the frontend as date in local format.
// -----------------------------------------------------------------------------
export function showLocaleDate(date: string) {
  const _date = new Date(date);
  if (isNaN(_date.getTime())) throw new Error("invalid date");

  return _date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// -----------------------------------------------------------------------------
// The generated value will be used in the frontend as datetime in local format.
// -----------------------------------------------------------------------------
export function showLocaleDatetime(date: string) {
  const _date = new Date(date);
  if (isNaN(_date.getTime())) throw new Error("invalid date");

  return _date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// -----------------------------------------------------------------------------
// to "08:30 AM - 10:00 PM" for the frontend.
// -----------------------------------------------------------------------------
export function toLocaleInterval(date: string, minutes: number) {
  const date0 = new Date(date);
  if (isNaN(date0.getTime())) throw new Error("invalid date");

  const date1 = new Date(date0.getTime() + minutes * 60 * 1000);
  if (isNaN(date1.getTime())) throw new Error("invalid date");

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
// time after M min from T as time string.
// HH:MM
// -----------------------------------------------------------------------------
export function getEndTime(time: string, minutes: number) {
  const day = today();

  const date0 = new Date(`${day}T${time}`);
  if (isNaN(date0.getTime())) throw new Error("invalid date");

  const date1 = new Date(date0.getTime() + minutes * 60 * 1000);
  if (isNaN(date1.getTime())) throw new Error("invalid date");

  return (
    ("0" + date1.getHours()).slice(-2) +
    ":" +
    ("0" + date1.getMinutes()).slice(-2)
  );
}

// -----------------------------------------------------------------------------
// get the duration as minutes (number)
// -----------------------------------------------------------------------------
export function getDuration(time0: string, time1: string) {
  const day = today();

  const date0 = new Date(`${day}T${time0}`);
  if (isNaN(date0.getTime())) throw new Error("invalid date");

  const date1 = new Date(`${day}T${time1}`);
  if (isNaN(date1.getTime())) throw new Error("invalid date");

  const millis = date1.getTime() - date0.getTime();
  const minutes = Math.round(millis / (1000 * 60));

  if (minutes > 0) {
    return minutes;
  } else {
    return 1440 + minutes;
  }
}

// -----------------------------------------------------------------------------
// if the time difference is less than 15 min then accept it as online
// -----------------------------------------------------------------------------
export function isOnline(date: string) {
  const now = new Date();

  const _date = new Date(date);
  if (isNaN(_date.getTime())) throw new Error("invalid date");

  const diff = _date.getTime() - now.getTime();

  return diff < 15 * 60 * 1000;
}

// -----------------------------------------------------------------------------
export function isToday(date: string) {
  const now = new Date();

  const _date = new Date(date);
  if (isNaN(_date.getTime())) throw new Error("invalid date");

  return (
    _date.getFullYear() === now.getFullYear() &&
    _date.getMonth() === now.getMonth() &&
    _date.getDate() === now.getDate()
  );
}

// -----------------------------------------------------------------------------
// It is an all day meeting if started at 00:00 (in local time) and its duration
// is 1440 min. Minutes is a string value with a number content to simplify
// codes because minutes is mostly available as string on UI.
// -----------------------------------------------------------------------------
export function isAllDay(date: string, minutes: string) {
  const _date = new Date(date);
  if (isNaN(_date.getTime())) throw new Error("invalid date");

  return (
    _date.getHours() === 0 && _date.getMinutes() === 0 && minutes === "1440"
  );
}

// -----------------------------------------------------------------------------
// Get the start time and duration and return if it is already ended
// -----------------------------------------------------------------------------
export function isOver(date: Date, minutes: number) {
  if (isNaN(date.getTime())) throw new Error("invalid date");

  const now = new Date();
  const endTime = date.getTime() + minutes * 60 * 1000;

  return now.getTime() > endTime;
}
