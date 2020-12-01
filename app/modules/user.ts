import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { methodNotAllowed } from "./helpers.ts";

// ----------------------------------------------------------------------------
async function getUser(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "user, get" }),
  });
}

// ----------------------------------------------------------------------------
async function createUser(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "user, post" }),
  });
}

// ----------------------------------------------------------------------------
async function deleteUser(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "user, delete" }),
  });
}

// ----------------------------------------------------------------------------
async function updateUser(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "user, patch" }),
  });
}

// ----------------------------------------------------------------------------
async function replaceUser(req: ServerRequest) {
  req.respond({
    body: JSON.stringify({ message: "user, put" }),
  });
}

// ----------------------------------------------------------------------------
export default async function (req: ServerRequest) {
  if (req.method === "GET") {
    await getUser(req);
  } else if (req.method === "POST") {
    await createUser(req);
  } else if (req.method === "DELETE") {
    await deleteUser(req);
  } else if (req.method === "PATCH") {
    await updateUser(req);
  } else if (req.method === "PUT") {
    await replaceUser(req);
  } else {
    methodNotAllowed(req);
  }
}
