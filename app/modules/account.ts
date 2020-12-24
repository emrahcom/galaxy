import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { Payload } from "https://deno.land/x/djwt/mod.ts";
import { methodNotAllowed } from "./helpers.ts";

// ----------------------------------------------------------------------------
async function getAccount(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "account, get" }),
  });
}

// ----------------------------------------------------------------------------
async function createAccount(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "account, post" }),
  });
}

// ----------------------------------------------------------------------------
async function deleteAccount(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "account, delete" }),
  });
}

// ----------------------------------------------------------------------------
async function updateAccount(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "account, patch" }),
  });
}

// ----------------------------------------------------------------------------
async function replaceAccount(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "account, put" }),
  });
}

// ----------------------------------------------------------------------------
export default async function (req: ServerRequest, payload: Payload) {
  if (req.method === "GET") {
    await getAccount(req);
  } else if (req.method === "POST") {
    await createAccount(req);
  } else if (req.method === "DELETE") {
    await deleteAccount(req);
  } else if (req.method === "PATCH") {
    await updateAccount(req);
  } else if (req.method === "PUT") {
    await replaceAccount(req);
  } else {
    methodNotAllowed(req);
  }
}
