<script lang="ts">
  import NavBarPri from "$lib/components/nav/bar-pri.svelte";
  import NavBarPub from "$lib/components/nav/bar-pub.svelte";

  const identity_id = window.localStorage.getItem("identity_id");
</script>

<!-- -------------------------------------------------------------------------->
{#if identity_id}
  <NavBarPri />
{:else}
  <NavBarPub />
{/if}

<div class="container-fluid d-flex flex-column h-100">
  <section id="hidden-top-margin" class="d-flex">
    <br />
    <br />
    <br />
    <br />
  </section>

  <slot />
</div>
