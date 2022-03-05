<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { AUTH_TYPE_OPTIONS } from "$lib/pri/domain";
  import { actionById } from "$lib/pri/api";
  import type { Domain } from "$lib/types";
  import Cancel from "$lib/components/pri/common/button-cancel.svelte";
  import RadioInline from "$lib/components/pri/common/form-radio-inline.svelte";
  import Submit from "$lib/components/pri/common/button-submit.svelte";
  import Text from "$lib/components/pri/common/form-text.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  export let p: Domain;

  let warning = false;

  function cancel() {
    window.location.href = "/pri/domain";
  }

  async function onSubmit() {
    try {
      warning = false;
      await actionById("/api/pri/domain/enable", p.id);
      window.location.href = "/pri/domain";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="enable">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" value={p.name} readonly={true} />
      <Text name="url" label="URL" value={p.auth_attr.url} readonly={true} />

      <p class="text-muted me-3 mb-1">Authentication Type</p>
      <RadioInline
        value={p.auth_type}
        options={AUTH_TYPE_OPTIONS}
        disabled={true}
      />

      {#if warning}
        <Warning>The enable request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <Submit label="Enable" />
      </div>
    </form>
  </div>
</section>
