import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { ringPhone } from "../database/intercom-call.ts";

const PRE = "/api/pub/intercom";

// -----------------------------------------------------------------------------
async function ring(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const intercomId = pl.id;

  return await ringPhone(code, intercomId);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/phone/ring`) {
    return await wrapper(ring, req);
  } else {
    return notFound();
  }
}
