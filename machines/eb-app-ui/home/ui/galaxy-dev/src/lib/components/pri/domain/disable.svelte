<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { AUTH_TYPE_OPTIONS } from "$lib/pri/domain";
  import { actionById } from "$lib/api";
  import type { Domain } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import RadioInline from "$lib/components/common/form-radio-inline.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: Domain;

  let warning = false;

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = "/pri/domain";
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await actionById("/api/pri/domain/disable", p.id);
      window.location.href = "/pri/domain";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="disable">
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
        <Warning>The disable request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <Submit label="Disable" />
      </div>
    </form>
  </div>
</section>
