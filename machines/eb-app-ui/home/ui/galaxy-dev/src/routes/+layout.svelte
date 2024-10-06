<script lang="ts">
  import { ping } from "$lib/pri/identity";
  import { intercomHandler } from "$lib/pri/intercom";
  import "bootstrap-icons/font/bootstrap-icons.min.css";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  import Brand from "$lib/components/nav/brand.svelte";
  import NavBarPri from "$lib/components/nav/bar-pri.svelte";
  import NavBarPub from "$lib/components/nav/bar-pub.svelte";

  const identity_id = window.localStorage.getItem("identity_id");
  if (identity_id) {
    ping();
    intercomHandler();
  }
</script>

<!-- -------------------------------------------------------------------------->
{#if identity_id}
  <NavBarPri />
{:else}
  <NavBarPub />
{/if}

<div class="container-fluid d-flex flex-column h-100">
  <!--
  The purpose of the following invisible section is to create free space equal
  to the navigation bar height. So, all contents will be located in the visible
  part below the navigation bar.

  One Bootstrap icon is also called here to make Bootstrap-icons CSS to be ready
  for the application.
  -->
  <section id="hidden-top-margin" class="d-flex invisible my-4">
    <Brand />
    <span class="bi bi-download" />
  </section>

  <slot />
</div>

<!-- Notifications will be added inside this container -->
<div aria-live="polite" aria-atomic="true" class="position-relative">
  <div id="notifications" class="toast-container bottom-0 end-0 p-3"></div>
</div>
