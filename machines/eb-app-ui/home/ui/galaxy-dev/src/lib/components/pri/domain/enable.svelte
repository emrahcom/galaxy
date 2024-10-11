<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { AUTH_TYPE_OPTIONS } from "$lib/pri/domain";
  import { actionById } from "$lib/api";
  import type { Domain } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import RadioInline from "$lib/components/common/form-radio-inline.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: Domain;

  let warning = false;
  let disabled = false;

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = "/pri/domain";
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      await actionById("/api/pri/domain/enable", p.id);
      globalThis.location.href = "/pri/domain";
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="enable">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <div class="d-flex gap-3 my-5 justify-content-center">
        <RadioInline
          value={p.auth_type}
          options={AUTH_TYPE_OPTIONS}
          disabled={true}
        />
      </div>

      <Text
        name="name"
        label="Name"
        value={p.name}
        disabled={true}
        readonly={true}
      />
      <Text
        name="url"
        label="URL"
        value={p.auth_type === "jaas"
          ? p.domain_attr.jaas_url
          : p.domain_attr.url}
        disabled={true}
        readonly={true}
      />

      {#if warning}
        <Warning>The enable request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel bind:disabled on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Enable" bind:disabled />
      </div>
    </form>
  </div>
</section>
