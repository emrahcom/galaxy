import { ServerRequest } from "https://deno.land/std/http/server.ts";
import {
  create,
  getNumericDate,
  Header,
  Payload,
  verify,
} from "https://deno.land/x/djwt/mod.ts";
import {
  JWT_ALG,
  JWT_AUD,
  JWT_ISS,
  JWT_SECRET,
  JWT_TIMEOUT,
} from "../config.ts";
import { query } from "./database.ts";

export interface TokenReq {
  email: string;
  passwd: string;
}

// ----------------------------------------------------------------------------
export async function getUserId(treq: TokenReq): Promise<string> {
  if (treq.email === undefined) throw new Error("missing email");
  if (treq.passwd === undefined) throw new Error("missing password");

  const sql = {
    text: `
      SELECT id
      FROM account
      WHERE email = $1
        AND passwd = $2
        AND active = true`,
    args: [
      treq.email,
      treq.passwd,
    ],
  };

  const uid = await query(sql)
    .then((rst) => {
      return String(rst.rows[0].id);
    });

  return uid;
}

// ----------------------------------------------------------------------------
export async function createToken(uid: string): Promise<string> {
  const header: Header = {
    alg: JWT_ALG,
    typ: "JWT",
  };

  const payload: Payload = {
    iss: JWT_ISS,
    aud: JWT_AUD,
    exp: getNumericDate(JWT_TIMEOUT),
    uid: uid,
  };

  return await create(header, payload, JWT_SECRET);
}
