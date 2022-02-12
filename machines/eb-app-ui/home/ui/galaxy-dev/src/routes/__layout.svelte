<script lang="ts">
  import { get } from "svelte/store";
  import { identity as id } from "$lib/stores/identity";
  import { setContext } from "svelte";
  import NavBarPri from "$lib/components/nav/bar-pri.svelte";
  import NavBarPub from "$lib/components/nav/bar-pub.svelte";

  export const identity = get(id);

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
