<script lang="ts" context="module">
  import { getIdentity } from "$lib/kratos";
  import { identity as id } from "$lib/stores/kratos";

  export async function load() {
    await getIdentity()
      .then((identity) => {
        id.set(identity);
      })
      .catch(() => {
        //no identity
      });

    return {};
  }
</script>

<!-- -------------------------------------------------------------------------->
<script lang="ts">
  import { get } from "svelte/store";
  import NavBarPri from "$lib/components/nav/bar-pri.svelte";
  import NavBarPub from "$lib/components/nav/bar-pub.svelte";

  const identity = get(id);
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
