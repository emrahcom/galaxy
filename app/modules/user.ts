import { ServerRequest } from "https://deno.land/std/http/server.ts";

// ----------------------------------------------------------------------------
export default function (req: ServerRequest) {
  if (req.method === "GET") {
    req.respond({
      body: JSON.stringify({ message: "user, get" }),
    });
  } else if (req.method === "POST") {
    req.respond({
      body: JSON.stringify({ message: "user, post" }),
    });
  } else if (req.method === "DELETE") {
    req.respond({
      body: JSON.stringify({ message: "user, delete" }),
    });
  } else if (req.method === "PUT") {
    req.respond({
      body: JSON.stringify({ message: "user, put" }),
    });
  } else if (req.method === "PATCH") {
    req.respond({
      body: JSON.stringify({ message: "user, patch" }),
    });
  } else {
    req.respond({
      body: JSON.stringify({ message: "user, unsupported method" }),
    });
  }
}
