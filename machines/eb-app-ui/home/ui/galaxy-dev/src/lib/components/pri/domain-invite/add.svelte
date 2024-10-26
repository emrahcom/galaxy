<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import type { Domain } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    domain: Domain;
  }

  let { domain }: Props = $props();

  const date = new Date();

  let warning = $state(false);
  let disabled = $state(false);
  let p = $state({
    name: `invite-${date.getTime() % 10000000000}`,
    domain_id: domain.id,
  });

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = `/pri/domain/invite/${domain.id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      await action("/api/pri/domain/invite/add", p);
      globalThis.location.href = `/pri/domain/invite/${domain.id}`;
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" bind:value={p.name} required={true} />
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
          The create request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel bind:disabled on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Create" bind:disabled />
      </div>
    </form>
  </div>
</section>
