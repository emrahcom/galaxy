import { query } from "./lib/database.ts";

// ------------------------------------------------------------------------------
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
  const sql = {
    text: `
      INSERT INTO identity (id)
      VALUES ($1)`,
    args: [
      identityId,
    ],
  };

  await query(sql);

  req.respondWith(
    new Response(`${identityId} added`, {
      status: 200,
    }),
  );
}
