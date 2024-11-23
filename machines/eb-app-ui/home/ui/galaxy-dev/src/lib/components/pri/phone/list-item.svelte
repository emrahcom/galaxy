<script lang="ts">
  import { page } from "$app/stores";
  import type { Phone } from "$lib/types";
  import Copy from "$lib/components/common/button-copy.svelte";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Update from "$lib/components/common/link-update.svelte";

  interface Props {
    p: Phone;
  }

  let { p }: Props = $props();

  // ---------------------------------------------------------------------------
  function copy(code: string) {
    const text = `${$page.url.origin}/aud/phone/${code}`;

    navigator.clipboard.writeText(text);
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div
    class="card h-100 {p.enabled && p.domain_enabled ? '' : 'border-danger'}"
  >
    <div class="card-body text-center">
      <h5 class="card-title text-muted">{p.name}</h5>

      <p class="card-text text-muted">
        {$page.url.origin}/aud/phone/{p.code}
      </p>

      {#if p.enabled}
        <Copy label="copy" onclick={() => copy(p.code)} />
      {/if}
    </div>

    <div class="card-footer bg-body border-0 text-center">
      <Del href="/pri/phone/del/{p.id}" />

      {#if p.enabled}
        <Disable href="/pri/phone/disable/{p.id}" />
      {:else}
        <Enable href="/pri/phone/enable/{p.id}" />
      {/if}

      <Update href="/pri/phone/update/{p.id}" />
    </div>
  </div>
</div>
