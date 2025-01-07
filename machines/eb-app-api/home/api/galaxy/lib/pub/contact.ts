import { getLimit, getOffset } from "../database/common.ts";
import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { callContactByKey, listContactByKey } from "../database/contact.ts";

const PRE = "/api/pub/contact";

// -----------------------------------------------------------------------------
async function list(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listContactByKey(keyValue, limit, offset);
}

// -----------------------------------------------------------------------------
async function call(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const contactId = pl.contact_id;

  return await callContactByKey(keyValue, contactId);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/list`) {
    return await wrapper(list, req);
  } else if (path === `${PRE}/call`) {
    return await wrapper(call, req);
  } else {
    return notFound();
  }
}
