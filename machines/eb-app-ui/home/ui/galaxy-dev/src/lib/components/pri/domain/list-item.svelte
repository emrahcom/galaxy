<script lang="ts">
  import type { Domain333 } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Invite from "$lib/components/common/link-invite.svelte";
  import People from "$lib/components/common/link-people.svelte";
  import Update from "$lib/components/common/link-update.svelte";

  interface Props {
    p: Domain333;
  }

  let { p }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100 {p.enabled ? '' : 'border-danger'}">
    <div class="card-body text-center">
      <h5 class="card-title text-muted">{p.name}</h5>
      <p class="card-text text-muted">{p.url}</p>
      <p class="card-text text-muted small">{p.ownership}</p>
    </div>

    <div class="card-footer bg-body border-0 text-center">
      {#if p.ownership === "owner"}
        <Del href="/pri/domain/del/{p.id}" />

        {#if p.enabled}
          <Disable href="/pri/domain/disable/{p.id}" />
        {:else}
          <Enable href="/pri/domain/enable/{p.id}" />
        {/if}

        <Update href="/pri/domain/update/{p.id}" />
        <Invite
          href="/pri/domain/invite/{p.id}"
          title="Show keys (partnership links)"
        />
        <People
          href="/pri/domain/partner/{p.id}"
          title="Show domain partners"
        />
      {:else if p.ownership === "partner"}
        <Del href="/pri/domain/partnership/del/{p.partnership_id}" />
      {/if}
    </div>
  </div>
</div>
