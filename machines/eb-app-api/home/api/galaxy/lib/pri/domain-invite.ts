import { notFound } from "../http/response.ts";

const PRE = "/api/pri/meeting/invite";

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    console.log("get");
  } else {
    return notFound();
  }
}
