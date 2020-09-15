import { ServerRequest } from "https://deno.land/std/http/server.ts";

export const about = (req: ServerRequest) =>
  req.respond({
    body: "galaxy",
  });

export const notFound = (req: ServerRequest) =>
  req.respond({
    status: 404,
    body: "not found",
  });

export const forbidden = (req: ServerRequest) =>
  req.respond({
    status: 403,
    body: "forbidden",
  });
