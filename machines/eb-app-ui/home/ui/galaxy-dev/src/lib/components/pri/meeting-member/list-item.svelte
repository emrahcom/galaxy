<script lang="ts">
  import type { MeetingMember } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import SetGuest from "$lib/components/common/link-set-guest.svelte";
  import SetHost from "$lib/components/common/link-set-host.svelte";

  interface Props {
    p: MeetingMember;
  }

  let { p }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100 {p.enabled ? '' : 'border-danger'}">
    <div class="card-body text-center">
      <h5 class="card-title text-muted">
        {p.contact_name || p.profile_name || ""}
      </h5>

      <p class="card-text text-muted">{p.profile_email || ""}</p>
      <p class="card-text text-muted">{p.join_as}</p>
    </div>

    <div class="card-footer bg-body border-0 text-center">
      <Del href="/pri/meeting/member/del/{p.id}" />

      {#if p.enabled}
        <Disable href="/pri/meeting/member/disable/{p.id}" />
      {:else}
        <Enable href="/pri/meeting/member/enable/{p.id}" />
      {/if}

      {#if p.join_as === "guest"}
        <SetHost href="/pri/meeting/member/set/host/{p.id}" />
      {:else}
        <SetGuest href="/pri/meeting/member/set/guest/{p.id}" />
      {/if}
    </div>
  </div>
</div>
