export function unauthorized(req: Deno.RequestEvent) {
  req.respondWith(
    new Response("Unauthorized", {
      status: 401,
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
