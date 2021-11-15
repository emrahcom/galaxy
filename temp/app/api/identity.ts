import { ServerRequest } from "https://deno.land/std/http/server_legacy.ts";
import { methodNotAllowed, unauthorized } from "./helpers.ts";
import { UserPayload } from "./token.ts";

// ----------------------------------------------------------------------------
function getIdentity(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "identity, get" }),
  });
}

// ----------------------------------------------------------------------------
function createIdentity(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "identity, post" }),
  });
}

// ----------------------------------------------------------------------------
function deleteIdentity(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "identity, delete" }),
  });
}

// ----------------------------------------------------------------------------
function updateIdentity(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "identity, patch" }),
  });
}

// ----------------------------------------------------------------------------
function replaceIdentity(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "identity, put" }),
  });
}

// ----------------------------------------------------------------------------
export default async function (req: ServerRequest, pl: UserPayload) {
  if (req.method === "GET") {
    await getIdentity(req);
  } else if (req.method === "POST") {
    await createIdentity(req);
  } else if (req.method === "DELETE") {
    await deleteIdentity(req);
  } else if (req.method === "PATCH") {
    await updateIdentity(req);
  } else if (req.method === "PUT") {
    await replaceIdentity(req);
  } else {
    methodNotAllowed(req);
  }
}
