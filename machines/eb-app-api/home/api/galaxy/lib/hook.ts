export function hello(req: Deno.RequestEvent) {
  req.respondWith(
    new Response(`hello public`, {
      status: 200,
    }),
  );
}

// -----------------------------------------------------------------------------
export function addIdentity(req: Deno.RequestEvent, identityId: string) {
  req.respondWith(
    new Response(`${identityId} added`, {
      status: 200,
    }),
  );
}
