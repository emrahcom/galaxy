import { ServerRequest } from "https://deno.land/std/http/server.ts";

export default function (req: ServerRequest) {
  if (req.method === "GET") {
    req.respond({
      body: "user get",
    });
  } else if (req.method === "POST") {
    req.respond({
      body: "user post",
    });
  } else {
    req.respond({
      body: "user not supported",
    });
  }
}
