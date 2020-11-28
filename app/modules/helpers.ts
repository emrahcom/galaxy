import { ServerRequest } from "https://deno.land/std/http/server.ts";

// ----------------------------------------------------------------------------
export const about = (req: ServerRequest) =>
  req.respond({
    body: JSON.stringify({ message: "galaxy" }),
  });

// ----------------------------------------------------------------------------
export const forbidden = (req: ServerRequest) =>
  req.respond({
    status: 403,
    body: JSON.stringify({ message: "forbidden" }),
  });

// ----------------------------------------------------------------------------
export const internalServerError = (req: ServerRequest) =>
  req.respond({
    status: 500,
    body: JSON.stringify({ message: "internal server error" }),
  });

// ----------------------------------------------------------------------------
export const ok = (req: ServerRequest, resBody: string) =>
  req.respond({
    status: 200,
    body: resBody,
  });

// ----------------------------------------------------------------------------
export const methodNotAllowed = (req: ServerRequest) =>
  req.respond({
    status: 405,
    body: JSON.stringify({ message: "method not allowed" }),
  });

// ----------------------------------------------------------------------------
export const notFound = (req: ServerRequest) =>
  req.respond({
    status: 404,
    body: JSON.stringify({ message: "not found" }),
  });

// ----------------------------------------------------------------------------
export const unauthorized = (req: ServerRequest) =>
  req.respond({
    status: 401,
    body: JSON.stringify({ message: "unauthorized" }),
  });

// ----------------------------------------------------------------------------
export const parseRequestBody = async <T>(req: ServerRequest): Promise<T> => {
  try {
    const str = new TextDecoder("utf-8").decode(await Deno.readAll(req.body));
    return JSON.parse(str);
  } catch (error) {
    return {} as T;
  }
};
