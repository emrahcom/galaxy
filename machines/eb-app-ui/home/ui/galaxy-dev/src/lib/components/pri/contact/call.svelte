<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, list } from "$lib/api";
  import type { Contact, Domain333 } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Email from "$lib/components/common/form-email.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: Contact;

  let warning = false;
  let domain_id = "";

  const pr = list("/api/pri/domain/list", 100).then((items: Domain333[]) => {
    const enableds = items
      .filter((i) => i.enabled)
      .sort((i, j) => (i.updated_at > j.updated_at ? -1 : 1));
    if (enableds[0]) domain_id = enableds[0].id;

    return enableds.map((i) => [i.id, i.name]);
  });

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = "/pri/contact";
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      const data = {
        contact_id: p.id,
        domain_id: domain_id,
      };
      await action("/api/pri/contact/call", data);
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="call">
  {#await pr then domains}
    <div class="d-flex mt-2 justify-content-center">
      <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
        <Text
          name="name"
          label="Contact"
          value={p.name}
          disabled={true}
          readonly={true}
        />
        <Text
          name="profile_name"
          label="Name"
          value={p.profile_name || ""}
          disabled={true}
          readonly={true}
        />
        <Email
          name="profile_email"
          label="Email"
          value={p.profile_email || ""}
          disabled={true}
          readonly={true}
        />
        <Select
          id="domain_id"
          label="Jitsi Domain"
          bind:value={domain_id}
          options={domains}
        />

        {#if warning}
          <Warning>The call request is not accepted.</Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel on:click={cancel} />
          <SubmitBlocker />
          <Submit label="Call" />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
