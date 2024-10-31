<script lang="ts">
  import { list } from "$lib/api";
  import type { Contact, ContactStatus } from "$lib/types";
  import Call from "$lib/components/common/link-call.svelte";
  import Del from "$lib/components/common/link-del.svelte";
  import Update from "$lib/components/common/link-update.svelte";

  interface Props {
    p: Contact;
  }

  let { p }: Props = $props();

  let status = $state(0);

  // ---------------------------------------------------------------------------
  async function getContactStatus() {
    try {
      const now = new Date().getTime();
      const checkedAt =
        globalThis.localStorage.getItem("contact_checked_at") || "0";

      if (isNaN(Number(checkedAt))) {
        globalThis.localStorage.setItem("contact_checked_at", String(now));
      }

      if (now - Number(checkedAt) > 30000) {
        globalThis.localStorage.setItem("contact_checked_at", String(now));

        const status: ContactStatus[] = await list(
          "/api/pri/contact/list/status",
          1000,
        );
        globalThis.localStorage.setItem(
          "contact_status",
          JSON.stringify(status),
        );
      }
    } catch {
      // do nothing
    }
  }

  // ---------------------------------------------------------------------------
  async function showStatus() {
    try {
      await getContactStatus();

      const statusData = globalThis.localStorage.getItem("contact_status");
      if (!statusData) return;

      const contactStatusList = JSON.parse(statusData) as ContactStatus[];
      const contactStatus = contactStatusList.find((item) => item.id === p.id);
      if (!contactStatus) return;

      const seen = contactStatus.seen_second_ago;
      if (!seen) return;

      if (seen < 100) status = 1;
      else if (seen < 3600) status = 2;
      else status = 0;
    } finally {
      setTimeout(showStatus, 10000);
    }
  }

  // trigger the status get and show loop
  showStatus();
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
          <i class="bi bi-dot text-secondary ms-1"></i>
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
