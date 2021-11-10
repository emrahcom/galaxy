import { HOSTNAME, KRATOS, PORT } from "./config.ts";

// ----------------------------------------------------------------------------
async function handle(cnn: Deno.Conn) {
  const http = Deno.serveHttp(cnn);
  const whoami = `${KRATOS}/sessions/whoami`;

  for await (const req of http) {
    const cookie = req.request.headers.get("cookie");
    const res = await fetch(whoami, {
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Cookie": `${cookie}`,
      },
      mode: "cors",
    });
    const identityId = res.headers.get("x-kratos-authenticated-identity-id");

    req.respondWith(
      new Response(`hello ${identityId}`, {
        status: 200,
      }),
    );

    const url = new URL(req.request.url);
    console.log(`path: ${url.pathname}`);
  }
}

// ----------------------------------------------------------------------------
async function main() {
  const server = Deno.listen({
    hostname: HOSTNAME,
    port: PORT,
  });

  for await (const cnn of server) {
    handle(cnn);
  }
}

// ----------------------------------------------------------------------------
main();
