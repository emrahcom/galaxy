<script lang="ts">
  import type { IdentityKey333 } from "$lib/types";
  import Copy from "$lib/components/common/button-copy.svelte";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Update from "$lib/components/common/link-update.svelte";

  interface Props {
    p: IdentityKey333;
  }

  const { p }: Props = $props();

  const shadowedKey = $derived(
    p.value.slice(0, 2) + "*****" + p.value.slice(-2),
  );

  // ---------------------------------------------------------------------------
  function copy(keyValue: string) {
    navigator.clipboard.writeText(keyValue);
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100 {p.enabled && p.chain_enabled ? '' : 'border-danger'}">
    <div class="card-body text-center">
      <h5 class="card-title text-muted">{p.name}</h5>

      <p class="card-text text-muted">{shadowedKey}</p>

      {#if p.enabled && p.chain_enabled}
        <Copy label="copy" onclick={() => copy(p.value)} />
      {/if}
    </div>

    <div class="card-footer bg-body border-0 text-center">
      <Del href="/pri/identity/key/del/{p.id}" />

      {#if p.enabled}
        <Disable href="/pri/identity/key/disable/{p.id}" />
      {:else}
        <Enable href="/pri/identity/key/enable/{p.id}" />
      {/if}

      <Update href="/pri/identity/key/update/{p.id}" />
    </div>
  </div>
</div>
