import { redirect } from "@sveltejs/kit";
import { browser } from "$app/env";

export async function load() {
  if (!browser) return {};

  throw redirect(302, "/pri");
}
