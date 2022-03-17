<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import type { Domain } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let uuid: string;
  export let domain: Domain;

  let warning = false;
  let p = {
    name: "",
    domain_id: uuid,
  };

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/domain/invite/${uuid}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await action("/api/pri/domain/invite/add", p);
      window.location.href = `/pri/domain/invite/${uuid}`;
    } catch {
      warning = true;
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
        readonly={true}
      />
      <Text
        name="url"
        label="Jitsi Domain URL"
        value={domain.domain_attr.url}
        readonly={true}
      />

      {#if warning}
        <Warning>
          The add request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Add" />
      </div>
    </form>
  </div>
</section>
