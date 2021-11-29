import {
  getLimit,
  getOffset,
  pubMeetingRows,
  query,
} from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/pub/meeting";

// -----------------------------------------------------------------------------
export async function getMeeting(req: Deno.RequestEvent) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        SELECT id, name, info, schedule_type, schedule_attr, restricted, enabled
        FROM meeting
        WHERE id = $1 AND hidden = false`,
      args: [
        pl.id,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as pubMeetingRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function listEnabledMeeting(req: Deno.RequestEvent) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);

    const sql = {
      text: `
        SELECT id, name, info, schedule_type, schedule_attr, restricted, enabled
        FROM meeting
        WHERE hidden = false AND enabled = true
        ORDER BY name
        LIMIT $1 OFFSET $2`,
      args: [
        limit,
        offset,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as pubMeetingRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export default function (req: Deno.RequestEvent, path: string) {
  if (path === `${PRE}/get`) {
    getMeeting(req);
  } else if (path === `${PRE}/list/enabled`) {
    listEnabledMeeting(req);
  } else {
    notFound(req);
  }
}
