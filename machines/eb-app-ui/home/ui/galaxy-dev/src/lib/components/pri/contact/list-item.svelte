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
      if (contactStatus) status = contactStatus.seen_second_ago;
      console.error(status);
    } finally {
      setTimeout(updateStatus, 20000);
    }
  }

  updateStatus();
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100">
    <div class="card-body text-center">
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
