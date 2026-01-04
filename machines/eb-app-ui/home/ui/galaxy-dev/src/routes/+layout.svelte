<script lang="ts">
  import type { Snippet } from "svelte";
  import { ping } from "$lib/pri/identity";
  import { intercomHandler, updateMessageList } from "$lib/pri/intercom";
  import "bootstrap-icons/font/bootstrap-icons.min.css";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  import Brand from "$lib/components/nav/brand.svelte";
  import NavBarPri from "$lib/components/nav/bar-pri.svelte";
  import NavBarPub from "$lib/components/nav/bar-pub-kratos.svelte";
  import Messages from "$lib/components/pri/message/list.svelte";
  import type { IntercomMessage222 } from "$lib/types";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();

  let messages = $state([] as IntercomMessage222[]);

  const identity_id = globalThis.localStorage.getItem("identity_id");

  if (identity_id) {
    // get active messages while loading if this is an authenticated session
    messages = updateMessageList();

    // this listener will be triggered if a message event happens in this tab
    document.addEventListener("internalMessage", () => {
      messages = updateMessageList();
    });

    // this listener will be triggered if a message event happens in other tabs
    globalThis.addEventListener("storage", (e) => {
      if (e.key?.match("^msg-")) messages = updateMessageList();
    });

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
    <i class="bi bi-download"></i>
  </section>

  {@render children()}
</div>

{#if identity_id}
  <!-- Messages will be added inside this container -->
  <div aria-live="polite" aria-atomic="true" class="position-relative">
    <Messages {messages} />
  </div>
{/if}
