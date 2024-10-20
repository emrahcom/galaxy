import { internalServerError, ok } from "./response.ts";

// -----------------------------------------------------------------------------
type functionPri = (req: Request, identityId: string) => Promise<unknown>;

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
type functionPub = (req: Request) => Promise<unknown>;

export async function pub(f: functionPub, req: Request): Promise<Response> {
  try {
    const rows = await f(req);

    return ok(JSON.stringify(rows));
  } catch {
    return internalServerError();
  }
}

// -----------------------------------------------------------------------------
// Keycloak setup has its own version of adm wrapper. See wrapper-kc.ts
// -----------------------------------------------------------------------------
type functionAdm = (req: Request) => Promise<unknown>;

export async function adm(f: functionAdm, req: Request): Promise<Response> {
  try {
    const rows = await f(req);

    return ok(JSON.stringify(rows));
  } catch {
    return internalServerError();
  }
}
