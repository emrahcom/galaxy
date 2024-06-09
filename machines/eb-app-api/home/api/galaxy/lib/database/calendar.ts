import { fetch } from "./common.ts";
import {
  dateAfterXDays,
  getFirstDayOfMonth,
  getFirstDayOfWeek,
} from "../common/helper.ts";
import type { MeetingSchedule222 } from "./types.ts";

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
  const sql = {
    text: `
      SELECT pa.id, pa.domain_id, co.name as contact_name,
        pr.name as profile_name, pr.email as profile_email, pa.enabled,
        pa.created_at, pa.updated_at
      FROM domain_partner pa
        LEFT JOIN contact co ON co.identity_id = $1
                                AND co.remote_id = pa.identity_id
        LEFT JOIN profile pr ON pa.identity_id = pr.identity_id
                                AND pr.is_default
      WHERE pa.domain_id = $2
        AND EXISTS (SELECT 1
                    FROM domain
                    WHERE id = pa.domain_id
                      AND identity_id = $1
                   )
      ORDER BY profile_name, profile_email
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      firstDay,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as MeetingSchedule222[];
}
