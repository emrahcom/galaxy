<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import {
    AUTH_TYPE_OPTIONS,
    JAAS_ALGO,
    JAAS_AUD,
    JAAS_ISS,
    JAAS_URL,
    TOKEN_ALGO,
  } from "$lib/pri/domain";
  import { action } from "$lib/api";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Password from "$lib/components/common/form-password.svelte";
  import RadioInline from "$lib/components/common/form-radio-inline.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  let warning = false;
  let p = {
    name: "",
    auth_type: AUTH_TYPE_OPTIONS[0][0],
    domain_attr: {
      url: "",
      app_id: "",
      app_secret: "",
      app_alg: TOKEN_ALGO,
      jaas_url: JAAS_URL,
      jaas_app_id: "",
      jaas_kid: "",
      jaas_key: "",
      jaas_alg: JAAS_ALGO,
      jaas_aud: JAAS_AUD,
      jaas_iss: JAAS_ISS,
    },
  };

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = "/pri/domain";
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await action("/api/pri/domain/add", p);
      window.location.href = "/pri/domain";
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
        name="url"
        label="URL"
        bind:value={p.domain_attr.url}
        required={true}
      />

      <p class="text-muted me-3 mb-1">Authentication Type</p>
      <RadioInline bind:value={p.auth_type} options={AUTH_TYPE_OPTIONS} />

      {#if p.auth_type === "jaas"}
        <Text
          name="jaas_app_id"
          label="App ID"
          bind:value={p.domain_attr.jaas_app_id}
          required={true}
        />
        <Text
          name="jaas_kid"
          label="API Key ID"
          bind:value={p.domain_attr.jaas_kid}
          required={true}
        />
      {#else if p.auth_type === "token"}
        <Text
          name="app_id"
          label="App ID"
          bind:value={p.domain_attr.app_id}
          required={true}
        />
        <Password
          name="app_secret"
          label="App Secret"
          bind:value={p.domain_attr.app_secret}
          required={true}
        />
      {/if}

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
