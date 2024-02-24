<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, list } from "$lib/api";
  import type { Contact, Domain } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let domain: Domain;

  const pr = list("/api/pri/contact/list", 1000).then((items: Contact[]) => {
    return items.map((i) => [
      i.id,
      `${i.name}${i.profile_email ? ` (${i.profile_email})` : ""}`,
    ]);
  });

  let warning = false;
  let p = {
    contact_id: "",
    domain_id: domain.id,
  };

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/domain/partner/${domain.id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await action("/api/pri/domain/candidate/add", p);
      window.location.href = `/pri/domain/partner/${domain.id}`;
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  {#await pr then contacts}
    <div class="d-flex mt-2 justify-content-center">
      <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
        <Select
          id="contact_id"
          label="Contact"
          bind:value={p.contact_id}
          options={contacts}
        />
        <Text
          name="name"
          label="Jitsi Domain Name"
          value={domain.name}
          disabled={true}
          readonly={true}
        />
        <Text
          name="url"
          label="Jitsi Domain URL"
          value={domain.auth_type === "jaas"
            ? domain.domain_attr.jaas_url
            : domain.domain_attr.url}
          disabled={true}
          readonly={true}
        />

        {#if warning}
          <Warning>
            The invite request is not accepted. Please check your inputs.
          </Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel on:click={cancel} />
          <SubmitBlocker />
          <Submit label="Invite" />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
