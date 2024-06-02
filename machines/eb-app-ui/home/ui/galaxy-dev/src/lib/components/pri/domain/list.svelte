<script lang="ts">
  import type { Domain333, DomainPartnerCandidacy } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Invite from "$lib/components/common/link-invite.svelte";
  import People from "$lib/components/common/link-people.svelte";
  import Update from "$lib/components/common/link-update.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let domains: Domain333[];
  export let candidacies: DomainPartnerCandidacy[];

  const isEmpty = !(domains.length || candidacies.length);
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="d-flex mx-auto mt-2 g-3">
    {#each domains as p}
      <div class="col-md-6 col-xl-4">
        <div class="card h-100 {p.enabled ? '' : 'border-danger'}">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{p.name}</h5>
            <p class="card-text text-muted">{p.url}</p>
            <p class="card-text text-muted small">{p.ownership}</p>
          </div>

          <div class="card-footer bg-body border-0 text-center">
            {#if p.ownership === "owner"}
              <Del href="/pri/domain/del/{p.id}" />

              {#if p.enabled}
                <Disable href="/pri/domain/disable/{p.id}" />
              {:else}
                <Enable href="/pri/domain/enable/{p.id}" />
              {/if}

              <Update href="/pri/domain/update/{p.id}" />
              <Invite href="/pri/domain/invite/{p.id}" />
              <People href="/pri/domain/partner/{p.id}" />
            {:else if p.ownership === "partner"}
              <Del href="/pri/domain/partnership/del/{p.partnership_id}" />
            {/if}
          </div>
        </div>
      </div>
    {/each}

    {#each candidacies as c}
      <div class="col-md-6 col-xl-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{c.domain_name}</h5>
            <p class="card-text text-muted">{c.domain_url}</p>
            <p class="card-text text-muted small">partner</p>

            {#if c.status == "pending"}
              <p class="card-text fw-bold text-success">pending</p>
            {:else}
              <p class="card-text fw-bold text-warning">rejected</p>
            {/if}
          </div>

          <div class="card-footer bg-body border-0 text-center">
            {#if c.status == "pending"}
              <Disable href="/pri/domain/partner/candidacy/reject/{c.id}" />
            {/if}

            <Enable href="/pri/domain/partner/candidacy/accept/{c.id}" />
          </div>
        </div>
      </div>
    {/each}

    {#if isEmpty}
      <Warning>
        There is no domain in the list. Click <Add href="/pri/domain/add" /> to add
        a new domain.
      </Warning>
    {/if}
  </div>
</section>
