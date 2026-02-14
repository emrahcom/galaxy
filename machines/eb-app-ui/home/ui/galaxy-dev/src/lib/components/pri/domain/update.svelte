<script lang="ts">
  import { untrack } from 'svelte';
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
  import type { Domain } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Password from "$lib/components/common/form-password.svelte";
  import RadioInline from "$lib/components/common/form-radio-inline.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Url from "$lib/components/common/form-url.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Textarea from "$lib/components/common/form-textarea.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: Domain;
  }

  const { p: _p }: Props = $props();
  let p = $state(untrack(() => _p));

  // set default if there is no value
  if (!p.domain_attr.url) p.domain_attr.url = "";
  if (!p.domain_attr.app_id) p.domain_attr.app_id = "";
  if (!p.domain_attr.app_secret) p.domain_attr.app_secret = "";
  if (!p.domain_attr.app_alg) p.domain_attr.app_alg = TOKEN_ALGO;
  if (!p.domain_attr.jaas_url) p.domain_attr.jaas_url = JAAS_URL;
  if (!p.domain_attr.jaas_app_id) p.domain_attr.jaas_app_id = "";
  if (!p.domain_attr.jaas_kid) p.domain_attr.jaas_kid = "";
  if (!p.domain_attr.jaas_key) p.domain_attr.jaas_key = "";
  if (!p.domain_attr.jaas_alg) p.domain_attr.jaas_alg = JAAS_ALGO;
  if (!p.domain_attr.jaas_aud) p.domain_attr.jaas_aud = JAAS_AUD;
  if (!p.domain_attr.jaas_iss) p.domain_attr.jaas_iss = JAAS_ISS;

  let authType = $state(p.auth_type);
  let warning = $state(false);
  let disabled = $state(false);

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = "/pri/domain";
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      warning = false;
      disabled = true;

      p.auth_type = authType;
      await action("/api/pri/domain/update", p);

      globalThis.location.href = "/pri/domain";
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="update">
  <div class="d-flex mt-2 justify-content-center">
    <form {onsubmit} style="width:{FORM_WIDTH};">
      <div class="d-flex gap-3 my-5 justify-content-center">
        <RadioInline bind:value={authType} options={AUTH_TYPE_OPTIONS} />
      </div>

      <Text name="name" label="Name" bind:value={p.name} required={true} />

      {#if authType === "jaas"}
        <Url
          name="jaas_url"
          label="URL"
          bind:value={p.domain_attr.jaas_url}
          required={true}
          disabled={true}
          readonly={true}
        />
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
        <Textarea
          name="jaas_key"
          label="API Key Value (private)"
          bind:value={p.domain_attr.jaas_key}
          required={true}
        />
      {:else if authType === "token"}
        <Url
          name="url"
          label="URL"
          bind:value={p.domain_attr.url}
          required={true}
        />
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
      {:else}
        <Url
          name="url"
          label="URL"
          bind:value={p.domain_attr.url}
          required={true}
        />
      {/if}

      {#if warning}
        <Warning>
          The update request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel {disabled} onclick={cancel} />
        <SubmitBlocker />
        <Submit {disabled} label="Update" />
      </div>
    </form>
  </div>
</section>
