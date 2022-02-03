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
  import type { KratosIdentity } from "$lib/kratos-types";
  import NavbarPri from "$lib/components/navbar-pri.svelte";
  import NavbarPub from "$lib/components/navbar-pub.svelte";

  export let identity: KratosIdentity | undefined;
</script>

<!-- -------------------------------------------------------------------------->
{#if identity}
  <NavbarPri />
{:else}
  <NavbarPub />
{/if}

<section id="hidden-top-margin">
  <br />
  <br />
  <br />
</section>

<slot />
