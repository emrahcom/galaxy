<script lang="ts">
  import { isOnline, isToday, showLocaleDatetime } from "$lib/common";
  import type { MeetingMemberCandidacy } from "$lib/types";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";

  interface Props {
    p: MeetingMemberCandidacy;
  }

  let { p }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100">
    <div class="card-body text-center">
      <h5 class="card-title text-muted">{p.meeting_name}</h5>
      <p class="card-text text-muted small my-0">{p.join_as} member</p>
      <p class="card-text text-muted small">external domain</p>

      <div class="card-text fw-bold">
        {#if p.schedule_type === "scheduled"}
          {#if p.session_list.length}
            {#each p.session_list.slice(0, 3) as at (at)}
              {#if isOnline(at[0])}
                <p class="text-primary my-0">
                  {showLocaleDatetime(at[0])}
                </p>
              {:else if isToday(at[0])}
                <p class="text-warning my-0">
                  {showLocaleDatetime(at[0])}
                </p>
              {:else}
                <p class="text-secondary my-0">
                  {showLocaleDatetime(at[0])}
                </p>
              {/if}
            {/each}
          {:else}
            <p class="text-muted my-0">not planned</p>
          {/if}
        {:else if p.schedule_type === "permanent"}
          <p class="text-success my-0">permanent</p>
        {:else if p.schedule_type === "ephemeral"}
          <p class="text-primary my-0">online</p>
        {/if}
      </div>

      {#if p.meeting_info}
        <p
          class="d-inline-block card-text text-muted text-start
          text-truncate bg-light w-auto mt-3"
          style="max-width: 90%; white-space: pre"
        >
          {p.meeting_info}
        </p>
      {/if}

      {#if p.status == "pending"}
        <p class="card-text fw-bold text-success">pending</p>
      {:else}
        <p class="card-text fw-bold text-warning">rejected</p>
      {/if}
    </div>

    <div class="card-footer bg-body border-0 text-center">
      {#if p.status == "pending"}
        <Disable
          href="/pri/meeting/member/candidacy/reject/{p.id}"
          title="Reject membership"
        />
      {/if}

      <Enable
        href="/pri/meeting/member/candidacy/accept/{p.id}"
        title="Accept membership"
      />
    </div>
  </div>
</div>
