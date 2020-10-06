import { ServerRequest } from "https://deno.land/std/http/server.ts";

// ----------------------------------------------------------------------------
export const about = (req: ServerRequest) =>
  req.respond({
    body: JSON.stringify({ message: "galaxy" }),
  });

// ----------------------------------------------------------------------------
export const notFound = (req: ServerRequest) =>
  req.respond({
    status: 404,
    body: JSON.stringify({ message: "not found" }),
  });

// ----------------------------------------------------------------------------
export const forbidden = (req: ServerRequest) =>
  req.respond({
    status: 403,
    body: JSON.stringify({ message: "forbidden" }),
  });
