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

// ----------------------------------------------------------------------------
export const parseRequestBody = async <T>(req: ServerRequest): Promise<T> => {
  const buf = new Uint8Array(req.contentLength || 0);
  let bufSlice = buf;
  let totalRead = 0;

  while (true) {
    const nread = await req.body.read(bufSlice);
    if (nread === null) break;
    totalRead += nread;
    if (totalRead >= req.contentLength!) break;
    bufSlice = bufSlice.subarray(nread);
  }

  const str = new TextDecoder("utf-8").decode(bufSlice);
  return JSON.parse(str) as T;
};
