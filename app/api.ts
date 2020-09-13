import { serve } from "https://deno.land/std/http/server.ts";

const HOSTNAME = "127.0.0.1";
const PORT = 8000;

const s = serve({
  hostname: HOSTNAME,
  port: PORT,
});

for await (const req of s) {
  req.respond({ body: "Hello World\\n" });
}
