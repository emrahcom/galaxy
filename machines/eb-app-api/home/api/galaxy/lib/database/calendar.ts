//import { fetch } from "./common.ts";
import {
  dateAfterXDays,
  getFirstDayOfMonth,
  getFirstDayOfWeek,
} from "../common/helper.ts";

// -----------------------------------------------------------------------------
export async function listSessionByMonth(
  identityId: string,
  date: string,
  limit: number,
  offset: number,
) {
  // First, find the first day of the month then find the first day of the week
  // which this day belongs to. Don't use this day as the beginning of the
  // period because dates in databases are in UTC but UI may use a different
  // time zone. So, take one day earlier as the beginning of the period. UI will
  // filter out the date which are not in UI time zone.
  const firstOfMonth = getFirstDayOfMonth(date);
  const firstOfWeek = getFirstDayOfWeek(firstOfMonth);
  const firstDay = dateAfterXDays(firstOfWeek, -1);

  await console.log(identityId);
  await console.log(firstDay);
  await console.log(limit);
  await console.log(offset);

  return [];
}
