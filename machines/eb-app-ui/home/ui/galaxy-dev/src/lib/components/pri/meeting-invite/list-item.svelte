<script lang="ts">
  import { page } from "$app/stores";
  import { showLocaleDatetime } from "$lib/common";
  import type { MeetingInvite } from "$lib/types";
  import Copy from "$lib/components/common/button-copy.svelte";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import QRCode from "$lib/components/common/qrcode.svelte";

  interface Props {
    p: MeetingInvite;
  }

  const { p }: Props = $props();

  // ---------------------------------------------------------------------------
  function copyForMember(code: string) {
    let text = `${$page.url.origin}/pri/meeting/membership/add/${code}`;

    navigator.clipboard.writeText(text);
  }

  // ---------------------------------------------------------------------------
  function copyForAudience(code: string, schedule_type: string) {
    let text: string;

    if (schedule_type === "scheduled") {
      text = `${$page.url.origin}/aud/wait/${code}`;
    } else {
      text = `${$page.url.origin}/aud/join/${code}`;
    }

    navigator.clipboard.writeText(text);
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100 {p.enabled ? '' : 'border-danger'}">
    <div class="card-body text-center">
      <h5 class="card-title text-muted">{p.name}</h5>
      <p class="card-text text-muted small">
        {showLocaleDatetime(p.expired_at)}
      </p>

      <p class="card-text text-muted small">
        {p.invite_to} as {p.join_as}
      </p>

      {#if p.invite_to === "member"}
        <QRCode
          data="{$page.url.origin}/pri/meeting/partnership/add/{p.code}"
        />

        <p class="card-text text-muted">
          {$page.url.origin}/pri/meeting/partnership/add/{p.code}
        </p>

        {#if p.enabled}
          <Copy label="copy" onclick={() => copyForMember(p.code)} />
        {/if}
      {:else}
        {#if p.meeting_schedule_type === "scheduled"}
          <QRCode data="{$page.url.origin}/aud/wait/{p.code}" />
        {:else}
          <QRCode data="{$page.url.origin}/aud/join/{p.code}" />
        {/if}

        <p class="card-text text-muted">
          {#if p.meeting_schedule_type === "scheduled"}
            {$page.url.origin}/aud/wait/{p.code}
          {:else}
            {$page.url.origin}/aud/join/{p.code}
          {/if}
        </p>

        {#if p.enabled}
          <Copy
            label="copy"
            onclick={() => copyForAudience(p.code, p.meeting_schedule_type)}
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
