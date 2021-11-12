export function hello(req: Deno.RequestEvent) {
  req.respondWith(
    new Response(`hello public`, {
      status: 200,
    }),
  );
}

// ------------------------------------------------------------------------------
export function addIdentity(req: Deno.RequestEvent) {
  const pl = await req.request.json();
  const identityId = pl.identity_id;

  req.respondWith(
    new Response(`${identityId} added`, {
      status: 200,
    }),
  );
}
