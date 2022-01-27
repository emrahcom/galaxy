<script lang="ts" context="module">
  import { getIdentity } from "$lib/kratos";
  import type { LoadOutput } from "$lib/custom-types";

  export async function load(): Promise<LoadOutput> {
    const identity = await getIdentity();

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
  import NavbarPri from "$lib/components/navbar-pri.svelte";
  import NavbarPub from "$lib/components/navbar-pub.svelte";

  export let identity: KratosIdentity;
  setContext("identity", identity);
</script>

<!-- -------------------------------------------------------------------------->
{#if identity}
  <NavbarPri />
{:else}
  <NavbarPub />
{/if}

<div class="container-fluid">
  <br />
  <br />
  <br />
  <slot />
</div>
