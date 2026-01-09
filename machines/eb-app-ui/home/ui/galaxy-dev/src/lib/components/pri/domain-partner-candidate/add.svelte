<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, listById } from "$lib/api";
  import type { Contact, Domain } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    domain: Domain;
  }

  const { domain }: Props = $props();

  const pr = $derived(
    listById("/api/pri/contact/list/bydomain", domain.id, 1000).then(
      (items: Contact[]) => {
        return items.map((i) => [
          i.id,
          `${i.name}${i.profile_email ? ` (${i.profile_email})` : ""}`,
        ]);
      },
    ),
  );

  let p = $state({
    contact_id: "",
    get domain_id() {
      return domain.id;
    },
  });

  let warning = $state(false);
  let disabled = $state(false);

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = `/pri/domain/partner/${domain.id}`;
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      warning = false;
      disabled = true;

      await action("/api/pri/domain/partner/candidate/add", p);
      globalThis.location.href = `/pri/domain/partner/${domain.id}`;
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  {#await pr then contacts}
    <div class="d-flex mt-2 justify-content-center">
      <form {onsubmit} style="width:{FORM_WIDTH};">
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
          <Cancel {disabled} onclick={cancel} />
          <SubmitBlocker />
          <Submit {disabled} label="Invite" />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
