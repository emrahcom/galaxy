<script lang="ts">
  import type { Room333 } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Invite from "$lib/components/common/link-invite.svelte";
  import Join from "$lib/components/common/link-join.svelte";
  import People from "$lib/components/common/link-people.svelte";
  import Update from "$lib/components/common/link-update.svelte";

  interface Props {
    p: Room333;
  }

  let { p }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100 {p.enabled && p.chain_enabled ? '' : 'border-danger'}">
    <div class="card-body text-center">
      <h5 class="card-title text-muted">{p.name}</h5>
      <p class="card-text text-muted">{p.domain_name}</p>
      <p class="card-text text-muted small">{p.ownership}</p>
    </div>

    <div class="card-footer bg-body border-0 text-center">
      {#if p.ownership === "owner"}
        <Del href="/pri/room/del/{p.id}" />

        {#if p.enabled}
          <Disable href="/pri/room/disable/{p.id}" />
        {:else}
          <Enable href="/pri/room/enable/{p.id}" />
        {/if}

        <Update href="/pri/room/update/{p.id}" />
        <Invite
          href="/pri/room/invite/{p.id}"
          title="Show keys (partnership links)"
        />
        <People href="/pri/room/partner/{p.id}" title="Show room partners" />

        {#if p.chain_enabled}
          <Join href="/pri/room/join/{p.id}" title="Join meeting room" />
        {/if}
      {:else if p.ownership === "partner"}
        <Del href="/pri/room/partnership/del/{p.partnership_id}" />

        {#if p.enabled && p.chain_enabled}
          <Join href="/pri/room/join/{p.id}" title="Join meeting room" />
        {/if}
      {/if}
    </div>
  </div>
</div>
