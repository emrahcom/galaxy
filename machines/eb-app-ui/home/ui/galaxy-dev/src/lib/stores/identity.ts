import { readable } from "svelte/store";
import { getIdentity } from "$lib/kratos";

export const identity = readable(
  await getIdentity().catch(() => {
    return undefined;
  }),
);
