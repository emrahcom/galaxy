<script lang="ts">
  import type { Contact, ContactStatus } from "$lib/types";
  import Call from "$lib/components/common/link-call.svelte";
  import Del from "$lib/components/common/link-del.svelte";
  import Update from "$lib/components/common/link-update.svelte";

  export let p: Contact;
  let status = 0;

  function updateStatus() {
    try {
      const statusData = globalThis.localStorage.getItem("contact_status");
      if (!statusData) return;

      const contactStatusList = JSON.parse(statusData) as ContactStatus[];
      const contactStatus = contactStatusList.find((item) => item.id === p.id);
      if (!contactStatus) return;

      const seen = contactStatus.seen_second_ago;
      if (!seen) return;

      if (seen < 100) status = 1;
      else if (seen < 3600) status = 2;
    } finally {
      setTimeout(updateStatus, 20000);
    }
  }

  // wait for a while to allow contactHandler to get the initital status before
  // showing the status on UI
  setTimeout(updateStatus, 8000);
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100">
    <div class="card-body text-center">
      <div class="position-absolute top-0 start-0">
        {#if status === 1}
          <i class="bi bi-circle-fill text-success ms-1"></i>
        {:else if status === 2}
          <i class="bi bi-circle-fill text-warning ms-1"></i>
        {:else}
          <i class="bi bi-circle-fill text-secondary ms-1"></i>
        {/if}
      </div>
      <h5 class="card-title text-muted">{p.name}</h5>
      <p class="card-text text-muted"></p>
      <p class="card-text text-muted">
        {p.profile_name || ""}<br />
        {p.profile_email || ""}
      </p>
    </div>

    <div class="card-footer bg-body border-0 text-center">
      <Del href="/pri/contact/del/{p.id}" />
      <Update href="/pri/contact/update/{p.id}" />
      <Call href="/pri/contact/call/{p.id}" />
    </div>
  </div>
</div>
