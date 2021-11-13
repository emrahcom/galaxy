export default function (req: Deno.RequestEvent) {
  req.respondWith(
    new Response(`hello public`, {
      status: 200,
    }),
  );
}
