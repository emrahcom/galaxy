<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { AUTH_TYPE_OPTIONS } from "$lib/pri/domain";
  import { action } from "$lib/api";
  import type { Domain } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Password from "$lib/components/common/form-password.svelte";
  import RadioInline from "$lib/components/common/form-radio-inline.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: Domain;

  let warning = false;

  function cancel() {
    window.location.href = "/pri/domain";
  }

  async function onSubmit() {
    try {
      warning = false;
      await action("/api/pri/domain/update", p);
      window.location.href = "/pri/domain";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="update">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" bind:value={p.name} required={true} />
      <Text
        name="url"
        label="URL"
        bind:value={p.auth_attr.url}
        required={true}
      />

      <p class="text-muted me-3 mb-1">Authentication Type</p>
      <RadioInline bind:value={p.auth_type} options={AUTH_TYPE_OPTIONS} />

      {#if p.auth_type === "token"}
        <Text
          name="app_id"
          label="App ID"
          bind:value={p.auth_attr.app_id}
          required={true}
        />
        <Password
          name="app_secret"
          label="App Secret"
          bind:value={p.auth_attr.app_secret}
          required={true}
        />
      {/if}

      {#if warning}
        <Warning>
          The update request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <Submit label="Update" />
      </div>
    </form>
  </div>
</section>
