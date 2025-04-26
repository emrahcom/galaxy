<script lang="ts">
  import { isOnline, isToday, showLocaleDatetime } from "$lib/common";
  import type { Meeting222 } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Invite from "$lib/components/common/link-invite.svelte";
  import Join from "$lib/components/common/link-join.svelte";
  import People from "$lib/components/common/link-people.svelte";
  import Schedule from "$lib/components/common/link-schedule.svelte";
  import Update from "$lib/components/common/link-update.svelte";

  interface Props {
    p: Meeting222;
  }

  let { p }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100 {p.enabled && p.chain_enabled ? '' : 'border-danger'}">
    <div class="card-body text-center">
      <h5 class="card-title text-muted">{p.name}</h5>

      {#if p.ownership === "owner"}
        <p class="card-text text-muted small my-0">{p.ownership}</p>
      {:else}
        <p class="card-text text-muted small my-0">
          {p.join_as}
          {p.ownership}
        </p>
      {/if}

      <p class="card-text text-muted small">
        {#if p.ownership === "owner"}
          {#if p.schedule_type === "ephemeral" || p.room_ephemeral}
            {`${p.domain_name}`}
          {:else}
            {`${p.room_name} on ${p.domain_name}`}
          {/if}
        {:else}
          external domain
        {/if}
      </p>

      <div class="card-text fw-bold">
        {#if p.schedule_type === "scheduled"}
          {#if p.session_at}
            {#each p.session_list.slice(0, 3) as at (at)}
              {#if isOnline(at)}
                <p class="text-primary my-0">{showLocaleDatetime(at)}</p>
              {:else if isToday(at)}
                <p class="text-warning my-0">{showLocaleDatetime(at)}</p>
              {:else}
                <p class="text-secondary my-0">
                  {showLocaleDatetime(at)}
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

      {#if p.info}
        <p
          class="d-inline-block card-text text-muted text-start
          text-truncate bg-light w-auto mt-3"
          style="max-width: 90%; white-space: pre"
        >
          {p.info}
        </p>
      {/if}
    </div>

    <div class="card-footer bg-body border-0 text-center">
      {#if p.ownership === "owner"}
        <Del href="/pri/meeting/del/{p.id}" />

        {#if p.enabled}
          <Disable href="/pri/meeting/disable/{p.id}" />
        {:else}
          <Enable href="/pri/meeting/enable/{p.id}" />
        {/if}

        <Update href="/pri/meeting/update/{p.id}" />
        <Invite
          href="/pri/meeting/invite/{p.id}"
          title="Show keys (membership links)"
        />

        {#if p.schedule_type !== "ephemeral"}
          <People href="/pri/meeting/member/{p.id}" title="Show members" />
        {/if}

        {#if p.schedule_type === "scheduled"}
          <Schedule href="/pri/meeting/schedule/{p.id}" />
        {/if}

        {#if p.chain_enabled}
          {#if p.schedule_type === "scheduled"}
            <Join href="/pri/owner/wait/{p.id}" title="Join the meeting" />
          {:else}
            <Join href="/pri/owner/join/{p.id}" title="Join the meeting" />
          {/if}
        {/if}
      {:else if p.ownership === "member"}
        <Del href="/pri/meeting/membership/del/{p.membership_id}" />
        <Update href="/pri/meeting/membership/update/{p.membership_id}" />

        {#if p.enabled && p.chain_enabled}
          {#if p.schedule_type === "scheduled"}
            <Join
              href="/pri/member/wait/{p.membership_id}"
              title="Join the meeting"
            />
          {:else}
            <Join
              href="/pri/member/join/{p.membership_id}"
              title="Join the meeting"
            />
          {/if}
        {/if}
      {/if}
    </div>
  </div>
</div>
