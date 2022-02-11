<script lang="ts" context="module">
  import { getIdentity } from "$lib/kratos";
  import type { KratosLoad } from "$lib/kratos-types";

  export async function load(): Promise<KratosLoad> {
    const identity = await getIdentity().catch(() => {
      return undefined;
    });

    return {
      props: {
        identity,
      },
    };
  }
</script>

<!-- -------------------------------------------------------------------------->
<script lang="ts">
  import { setContext } from "svelte";
  import type { KratosIdentity } from "$lib/kratos-types";
  import NavBarPri from "$lib/components/nav/bar-pri.svelte";
  import NavBarPub from "$lib/components/nav/bar-pub.svelte";

  export let identity: KratosIdentity | undefined;

  if (identity) setContext("identity", identity);
</script>

<!-- -------------------------------------------------------------------------->
{#if identity}
  <NavBarPri />
{:else}
  <NavBarPub />
{/if}

<section id="hidden-top-margin">
  <br />
  <br />
  <br />
  <br />
</section>

<slot />
