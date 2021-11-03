import { HOSTNAME, PORT } from "./config.ts";

// ----------------------------------------------------------------------------
async function handle(cnn: Deno.Conn) {
  const http = Deno.serveHttp(cnn);

  for await (const req of http) {
    req.respondWith(
      new Response("hello", {
        status: 200,
      }),
    );

    const url = new URL(req.request.url);
    console.log(url);
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
