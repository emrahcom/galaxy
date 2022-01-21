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

  export let identity: KratosIdentity;
  setContext("identity", identity);
</script>

<!-- -------------------------------------------------------------------------->
<nav class="navbar navbar-light bg-light fixed-top shadow">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">
      <img src="/logo.svg" alt="logo" width="32rem" height="32rem" />
    </a>
    <a class="navbar-link" href="/panel" title="Control Panel">
      <i class="bi bi-gear" />
    </a>
  </div>
</nav>

<div class="container-fluid">
  <br />
  <br />
  <br />
  <slot />
</div>
