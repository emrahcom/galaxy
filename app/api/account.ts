// @ts-ignore
import { ServerRequest } from "https://deno.land/std/http/server.ts";
// @ts-ignore
import { methodNotAllowed, unauthorized } from "./helpers.ts";
// @ts-ignore
import { UserPayload } from "./token.ts";

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
export default async function (req: ServerRequest, upl: UserPayload) {
  if (req.method === "GET") {
    await getAccount(req);
  } else if (req.method === "POST") {
    upl.account.admin ? await createAccount(req) : unauthorized(req);
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
