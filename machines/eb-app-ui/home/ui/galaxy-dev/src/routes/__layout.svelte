<script lang="ts" context="module">
  import { get } from "svelte/store";
  import { identity as id } from "$lib/stores/kratos";

  export const identity = get(id);
</script>

<!-- -------------------------------------------------------------------------->
<script lang="ts">
  import NavBarPri from "$lib/components/nav/bar-pri.svelte";
  import NavBarPub from "$lib/components/nav/bar-pub.svelte";
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
