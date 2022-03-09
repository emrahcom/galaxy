<script lang="ts" context="module">
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
</script>

<!-- -------------------------------------------------------------------------->
<script lang="ts">
  import NavBarPri from "$lib/components/nav/bar-pri.svelte";
  import NavBarPub from "$lib/components/nav/bar-pub.svelte";
</script>

<!-- -------------------------------------------------------------------------->
{#if $identity}
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

<div class="container-fluid">
  <slot />
</div>
