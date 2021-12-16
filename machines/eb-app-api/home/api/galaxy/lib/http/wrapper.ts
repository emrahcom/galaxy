import { internalServerError, ok } from "./response.ts";

// -----------------------------------------------------------------------------
type functionPri = (req: Deno.RequestEvent, identityId: string) => unknown;

export async function pri(
  f: functionPri,
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const rows = await f(req, identityId);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
type functionPub = (req: Deno.RequestEvent) => unknown;

export async function pub(f: functionPub, req: Deno.RequestEvent) {
  try {
    const rows = await f(req);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
type functionAdm = (req: Deno.RequestEvent) => unknown;

export async function adm(f: functionAdm, req: Deno.RequestEvent) {
  try {
    const rows = await f(req);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}
