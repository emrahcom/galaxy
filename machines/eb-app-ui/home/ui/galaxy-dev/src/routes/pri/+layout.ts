import { redirect } from "@sveltejs/kit";
import { browser } from "$app/env";
import { KRATOS } from "$lib/config";
import { get } from "svelte/store";
import identity from "$lib/stores/kratos/identity";

// ---------------------------------------------------------------------------
export async function load() {
  if (!browser) return {};

  const _identity = get(identity);

  if (!_identity.id) {
    throw redirect(302, `${KRATOS}/self-service/login/browser`);
  }

  return {};
}
