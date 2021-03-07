import { ServerRequest } from "https://deno.land/std/http/server.ts";
import {
  create,
  getNumericDate,
  Header,
  Payload,
  verify,
} from "https://deno.land/x/djwt/mod.ts";
import { QueryResult } from "https://deno.land/x/postgres/query.ts";
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
export async function isAuthenticated(treq: TokenReq): Promise<boolean> {
  if (treq.email === undefined) throw new Error("missing email");
  if (treq.passwd === undefined) throw new Error("missing password");

  const sql = {
    text: `
      SELECT *
      FROM account
      WHERE email = $1
        AND passwd = $2
        AND active = true`,
    args: [
      treq.email,
      treq.passwd,
    ],
  };

  const rst: QueryResult = await query(sql);

  return rst.rowCount && rst.rowCount > 0 ? true : false;
}

// ----------------------------------------------------------------------------
export async function createToken(treq: TokenReq): Promise<string> {
  const header: Header = {
    alg: JWT_ALG,
    typ: "JWT",
  };

  const payload: Payload = {
    iss: JWT_ISS,
    aud: JWT_AUD,
    exp: getNumericDate(JWT_TIMEOUT),
    account: {
      id: 123,
      email: treq.email,
    },
  };

  return await create(header, payload, JWT_SECRET);
}
