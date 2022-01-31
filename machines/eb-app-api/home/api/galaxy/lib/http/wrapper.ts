import { internalServerError, ok } from "./response.ts";

// -----------------------------------------------------------------------------
type functionPri = (req: Request, identityId: string) => unknown;

export async function pri(
  f: functionPri,
  req: Request,
  identityId: string,
): Promise<Response> {
  try {
    const rows = await f(req, identityId);

    return ok(JSON.stringify(rows));
  } catch {
    return internalServerError();
  }
}

// -----------------------------------------------------------------------------
type functionPub = (req: Request) => unknown;

export async function pub(f: functionPub, req: Request): Promise<Response> {
  try {
    const rows = await f(req);

    return ok(JSON.stringify(rows));
  } catch {
    return internalServerError();
  }
}

// -----------------------------------------------------------------------------
type functionAdm = (req: Request) => unknown;

export async function adm(f: functionAdm, req: Request): Promise<Response> {
  try {
    const rows = await f(req);

    return ok(JSON.stringify(rows));
  } catch {
    return internalServerError();
  }
}
