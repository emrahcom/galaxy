<script lang="ts">
  import { page } from "$app/stores";
  import { toLocaleTime } from "$lib/common";
  import type { MeetingInvite } from "$lib/types";
  import Copy from "$lib/components/common/button-copy.svelte";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let invites: MeetingInvite[];

  // ---------------------------------------------------------------------------
  function copyForMember(code: string) {
    const text = `${$page.url.origin}/pri/meeting/membership/add/${code}`;

    navigator.clipboard.writeText(text);
  }

  // ---------------------------------------------------------------------------
  function copyForAudience(code: string) {
    const text = `${$page.url.origin}/pub/meeting/join/${code}`;

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
            {#if p.invite_type === "member"}
              <p class="card-text text-muted small">
                {toLocaleTime(p.expired_at)}
              </p>

              <p class="card-text text-muted small">
                {p.invite_type} as {p.join_as}
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
                {p.invite_type} as {p.join_as}
              </p>

              <p class="card-text text-muted">
                {$page.url.origin}/pub/meeting/join/{p.code}
              </p>

              {#if p.enabled}
                <Copy label="copy" on:click={() => copyForAudience(p.code)} />
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
      <Warning>No participant key found for this meeting</Warning>
    {/each}
  </div>
</section>
