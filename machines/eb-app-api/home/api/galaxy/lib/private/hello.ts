export default function (req: Deno.RequestEvent, identityId: string) {
  req.respondWith(
    new Response(`hello ${identityId}`, {
      status: 200,
    }),
  );
}
