<script lang="ts">
  import { page } from "$app/stores";
  import { toLocaleTime } from "$lib/common";
  import type { MeetingInvite } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Copy from "$lib/components/common/button-copy.svelte";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let invites: MeetingInvite[];
  const meeting_id = $page.params.meeting_uuid;

  // ---------------------------------------------------------------------------
  function copyForMember(code: string) {
    let text = `${$page.url.origin}/pri/meeting/membership/add/${code}`;

    navigator.clipboard.writeText(text);
  }

  // ---------------------------------------------------------------------------
  function copyForAudience(code: string, schedule_type: string) {
    let text: string;

    if (schedule_type === "scheduled") {
      text = `${page.url.origin}/aud/waiting/${p.code}`;
    } else {
      text = `${page.url.origin}/aud/join/${p.code}`;
    }

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
            {#if p.invite_to === "member"}
              <p class="card-text text-muted small">
                {toLocaleTime(p.expired_at)}
              </p>

              <p class="card-text text-muted small">
                {p.invite_to} as {p.join_as}
              </p>

              <p class="card-text text-muted">
                {$page.url.origin}/pri/meeting/partnership/add/{p.code}
              </p>

              {#if p.enabled}
                <Copy label="copy" on:click={() => copyForMember(p.code)} />
              {/if}
            {:else}
              <p class="card-text text-muted small">permanent</p>

              <p class="card-text text-muted small">
                {p.invite_to} as {p.join_as}
              </p>

              <p class="card-text text-muted">
                {#if p.meeting_schedule_type === "scheduled"}
                  {$page.url.origin}/aud/waiting/{p.code}
                {:else}
                  {$page.url.origin}/aud/join/{p.code}
                {/if}
              </p>

              {#if p.enabled}
                <Copy
                  label="copy"
                  on:click={() =>
                    copyForAudience(p.code, p.meeting_schedule_type)}
                />
              {/if}
            {/if}
          </div>

          <div class="card-footer bg-body border-0 text-center">
            <Del href="/pri/meeting/invite/del/{p.id}" />

            {#if p.enabled}
              <Disable href="/pri/meeting/invite/disable/{p.id}" />
            {:else}
              <Enable href="/pri/meeting/invite/enable/{p.id}" />
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <Warning>
        This meeting has no participant keys. Click
        <Add href="/pri/meeting/invite/add/{meeting_id}" /> to create a new participant
        key and share it with your participants.
      </Warning>
    {/each}
  </div>
</section>
