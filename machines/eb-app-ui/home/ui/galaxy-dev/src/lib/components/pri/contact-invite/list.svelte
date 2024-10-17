<script lang="ts">
  import { page } from "$app/stores";
  import { showLocaleDatetime } from "$lib/common";
  import type { ContactInvite } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Copy from "$lib/components/common/button-copy.svelte";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let invites: ContactInvite[];

  // ---------------------------------------------------------------------------
  function copy(code: string) {
    const text = `${$page.url.origin}/pri/contact/friendship/add/${code}`;

    navigator.clipboard.writeText(text);
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each invites as p}
      <div class="col-md-6 col-xl-4">
        <div class="card h-100 {p.enabled ? '' : 'border-danger'}">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{p.name}</h5>

            <p class="card-text text-muted small">
              {showLocaleDatetime(p.expired_at)}
            </p>

            <p class="card-text text-muted">
              {$page.url.origin}/pri/contact/friendship/add/{p.code}
            </p>

            {#if p.enabled}
              <Copy label="copy" on:click={() => copy(p.code)} />
            {/if}
          </div>

          <div class="card-footer bg-body border-0 text-center">
            <Del href="/pri/contact/invite/del/{p.id}" />

            {#if p.enabled}
              <Disable href="/pri/contact/invite/disable/{p.id}" />
            {:else}
              <Enable href="/pri/contact/invite/enable/{p.id}" />
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <Warning>
        You have not a contact key. Click
        <Add href="/pri/contact/invite/add" /> to create a new contact key
        and share it with your friend.
      </Warning>
    {/each}
  </div>
</section>
