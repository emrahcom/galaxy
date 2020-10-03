import { ServerRequest } from "https://deno.land/std/http/server.ts";

export default function (req: ServerRequest) {
  if (req.method === "GET") {
    req.respond({
      body: JSON.stringify({ message: "user, get" }),
    });
  } else if (req.method === "POST") {
    req.respond({
      body: JSON.stringify({ message: "user, post" }),
    });
  } else {
    req.respond({
      body: JSON.stringify({ message: "user, not supported" }),
    });
  }
}
