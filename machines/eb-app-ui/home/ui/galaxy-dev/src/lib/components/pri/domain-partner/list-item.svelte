<script lang="ts">
  import type { DomainPartner } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";

  export let p: DomainPartner;
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100 {p.enabled ? '' : 'border-danger'}">
    <div class="card-body text-center">
      <h5 class="card-title text-muted">
        {p.contact_name || p.profile_name || ""}
      </h5>

      <p class="card-text text-muted">
        {p.profile_email || ""}
      </p>
    </div>

    <div class="card-footer bg-body border-0 text-center">
      <Del href="/pri/domain/partner/del/{p.id}" />

      {#if p.enabled}
        <Disable href="/pri/domain/partner/disable/{p.id}" />
      {:else}
        <Enable href="/pri/domain/partner/enable/{p.id}" />
      {/if}
    </div>
  </div>
</div>
