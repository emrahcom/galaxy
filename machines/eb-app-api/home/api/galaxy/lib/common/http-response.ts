export function methodNotAllowed(req: Deno.RequestEvent) {
  const body = {
    error: {
      message: "Method Not Allowed",
    },
  };

  req.respondWith(
    new Response(JSON.stringify(body), {
      status: 405,
    }),
  );
}

// -----------------------------------------------------------------------------
export function notFound(req: Deno.RequestEvent) {
  const body = {
    error: {
      message: "Not Found",
    },
  };

  req.respondWith(
    new Response(JSON.stringify(body), {
      status: 404,
    }),
  );
}

// -----------------------------------------------------------------------------
export function ok(req: Deno.RequestEvent, body: string) {
  req.respondWith(
    new Response(body, {
      status: 200,
    }),
  );
}

// -----------------------------------------------------------------------------
export function unauthorized(req: Deno.RequestEvent) {
  const body = {
    error: {
      message: "Unauthorized",
    },
  };

  req.respondWith(
    new Response(JSON.stringify(body), {
      status: 401,
    }),
  );
}
