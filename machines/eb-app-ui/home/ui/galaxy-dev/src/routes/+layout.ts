import { getIdentity } from "$lib/kratos";
import identity from "$lib/stores/kratos/identity";

// ---------------------------------------------------------------------------
export async function load() {
  await getIdentity()
    .then((_identity) => {
      identity.set(_identity);
    })
    .catch(() => {
      //no identity
    });

  return {};
}
