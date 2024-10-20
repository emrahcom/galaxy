<script lang="ts">
  import type { MeetingMemberCandidate } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";

  export let p: MeetingMemberCandidate;
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100">
    <div class="card-body text-center">
      <h5 class="card-title text-muted">
        {p.contact_name || p.profile_name || ""}
      </h5>

      <p class="card-text text-muted">{p.profile_email || ""}</p>
      <p class="card-text text-muted">{p.join_as}</p>

      {#if p.status == "pending"}
        <p class="card-text fw-bold text-success">pending</p>
      {:else}
        <p class="card-text fw-bold text-warning">rejected</p>
      {/if}
    </div>

    <div class="card-footer bg-body border-0 text-center">
      {#if p.status == "pending"}
        <Del href="/pri/meeting/member/candidate/del/{p.id}" />
      {/if}
    </div>
  </div>
</div>
