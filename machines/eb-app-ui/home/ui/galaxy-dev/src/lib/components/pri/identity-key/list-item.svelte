<script lang="ts">
  import type { IdentityKey } from "$lib/types";
  import Copy from "$lib/components/common/button-copy.svelte";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";

  interface Props {
    p: IdentityKey;
  }

  let { p }: Props = $props();

  const shadowedCode = p.code.slice(0, 2) + "*****" + p.code.slice(-2);

  // ---------------------------------------------------------------------------
  function copy(code: string) {
    navigator.clipboard.writeText(code);
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100 {p.enabled ? '' : 'border-danger'}">
    <div class="card-body text-center">
      <h5 class="card-title text-muted">{p.name}</h5>

      <p class="card-text text-muted">{shadowedCode}</p>

      {#if p.enabled}
        <Copy label="copy" onclick={() => copy(p.code)} />
      {/if}
    </div>

    <div class="card-footer bg-body border-0 text-center">
      <Del href="/pri/identity/key/del/{p.id}" />

      {#if p.enabled}
        <Disable href="/pri/identity/key/disable/{p.id}" />
      {:else}
        <Enable href="/pri/identity/key/enable/{p.id}" />
      {/if}
    </div>
  </div>
</div>
