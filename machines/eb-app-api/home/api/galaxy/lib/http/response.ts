export async function internalServerError(req: Deno.RequestEvent) {
  const body = {
    error: {
      message: "Internal Server Error",
    },
  };

  await req.respondWith(
    new Response(JSON.stringify(body), {
      status: 500,
    }),
  ).catch();
}

// -----------------------------------------------------------------------------
export async function methodNotAllowed(req: Deno.RequestEvent) {
  const body = {
    error: {
      message: "Method Not Allowed",
    },
  };

  await req.respondWith(
    new Response(JSON.stringify(body), {
      status: 405,
    }),
  ).catch();
}

// -----------------------------------------------------------------------------
export async function notFound(req: Deno.RequestEvent) {
  const body = {
    error: {
      message: "Not Found",
    },
  };

  await req.respondWith(
    new Response(JSON.stringify(body), {
      status: 404,
    }),
  ).catch();
}

// -----------------------------------------------------------------------------
export async function ok(req: Deno.RequestEvent, body: string) {
  await req.respondWith(
    new Response(body, {
      status: 200,
    }),
  ).catch();
}

// -----------------------------------------------------------------------------
export async function unauthorized(req: Deno.RequestEvent) {
  const body = {
    error: {
      message: "Unauthorized",
    },
  };

  await req.respondWith(
    new Response(JSON.stringify(body), {
      status: 401,
    }),
  ).catch();
}

// -----------------------------------------------------------------------------
type functionPri = (req: Deno.RequestEvent, identityId: string) => unknown;

export async function responsePri(
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

export async function responsePub(f: functionPub, req: Deno.RequestEvent) {
  try {
    const rows = await f(req);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}
