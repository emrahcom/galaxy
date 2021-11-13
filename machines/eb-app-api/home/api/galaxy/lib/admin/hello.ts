export default function (req: Deno.RequestEvent) {
  req.respondWith(
    new Response(`hello admin`, {
      status: 200,
    }),
  );
}
