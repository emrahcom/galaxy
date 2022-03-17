export function toLocaleTime(date: string) {
  const _date = new Date(date);

  return _date.toLocaleString();
}
