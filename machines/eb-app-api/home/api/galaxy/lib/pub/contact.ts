import { getLimit, getOffset } from "../database/common.ts";
import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { callContactByKey, listContactByKey } from "../database/contact.ts";

const PRE = "/api/pub/contact";

// -----------------------------------------------------------------------------
async function listByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listContactByKey(keyValue, limit, offset);
}

// -----------------------------------------------------------------------------
async function callByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const contactId = pl.contact_id;

  return await callContactByKey(keyValue, contactId);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/list/bykey`) {
    return await wrapper(listByKey, req);
  } else if (path === `${PRE}/call/bykey`) {
    return await wrapper(callByKey, req);
  } else {
    return notFound();
  }
}
