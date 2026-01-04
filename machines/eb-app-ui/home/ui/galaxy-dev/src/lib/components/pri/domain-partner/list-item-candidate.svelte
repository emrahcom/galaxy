<script lang="ts">
  import type { DomainPartnerCandidate } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";

  interface Props {
    p: DomainPartnerCandidate;
  }

  const { p }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100">
    <div class="card-body text-center">
      <h5 class="card-title text-muted">
        {p.contact_name || p.profile_name || ""}
      </h5>

      <p class="card-text text-muted">
        {p.profile_email || ""}
      </p>

      {#if p.status == "pending"}
        <p class="card-text fw-bold text-success">pending</p>
      {:else}
        <p class="card-text fw-bold text-warning">rejected</p>
      {/if}
    </div>

    <div class="card-footer bg-body border-0 text-center">
      {#if p.status == "pending"}
        <Del href="/pri/domain/partner/candidate/del/{p.id}" />
      {/if}
    </div>
  </div>
</div>
