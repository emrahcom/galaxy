export function methodNotAllowed(req: Deno.RequestEvent) {
  req.respondWith(
    new Response("Method Not Allowed", {
      status: 405,
    }),
  );
}

// -----------------------------------------------------------------------------
export function notFound(req: Deno.RequestEvent) {
  req.respondWith(
    new Response("Not Found", {
      status: 404,
    }),
  );
}

// -----------------------------------------------------------------------------
export function unauthorized(req: Deno.RequestEvent) {
  req.respondWith(
    new Response("Unauthorized", {
      status: 401,
    }),
  );
}
