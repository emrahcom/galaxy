export function hello(req: Deno.RequestEvent) {
  req.respondWith(
    new Response(`hello public`, {
      status: 200,
    }),
  );
}
