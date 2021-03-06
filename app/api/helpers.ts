import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { Status } from "https://deno.land/std/http/http_status.ts";

// ----------------------------------------------------------------------------
class BadRequest extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "BadRequest";
  }
}

// ----------------------------------------------------------------------------
export const about = (req: ServerRequest) =>
  req.respond({
    body: JSON.stringify({ message: "galaxy" }),
  });

// ----------------------------------------------------------------------------
export const forbidden = (req: ServerRequest) =>
  req.respond({
    status: Status.Forbidden,
    body: JSON.stringify({ message: "Forbidden" }),
  });

// ----------------------------------------------------------------------------
export const internalServerError = (req: ServerRequest) =>
  req.respond({
    status: Status.InternalServerError,
    body: JSON.stringify({ message: "InternalServerError" }),
  });

// ----------------------------------------------------------------------------
export const ok = (req: ServerRequest, resBody: string) =>
  req.respond({
    status: Status.OK,
    body: resBody,
  });

// ----------------------------------------------------------------------------
export const methodNotAllowed = (req: ServerRequest) =>
  req.respond({
    status: Status.MethodNotAllowed,
    body: JSON.stringify({ message: "MethodNotAllowed" }),
  });

// ----------------------------------------------------------------------------
export const notFound = (req: ServerRequest) =>
  req.respond({
    status: Status.NotFound,
    body: JSON.stringify({ message: "NotFound" }),
  });

// ----------------------------------------------------------------------------
export const unauthorized = (req: ServerRequest) =>
  req.respond({
    status: Status.Unauthorized,
    body: JSON.stringify({ message: "Unauthorized" }),
  });

// ----------------------------------------------------------------------------
export function parseQueryString(req: ServerRequest): URLSearchParams {
  const qs = req.url.match("[?].*$");
  if (!qs) throw new BadRequest("no query string");

  return new URLSearchParams(qs[0]);
}

// ----------------------------------------------------------------------------
export async function parseRequestBody<T>(req: ServerRequest): Promise<T> {
  const str = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));
  return JSON.parse(str);
}
