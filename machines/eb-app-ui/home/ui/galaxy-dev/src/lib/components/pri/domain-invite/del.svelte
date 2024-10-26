<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import type { DomainInvite } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: DomainInvite;
  }

  let { p }: Props = $props();

  let warning = $state(false);
  let disabled = $state(false);

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = `/pri/domain/invite/${p.domain_id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      await actionById("/api/pri/domain/invite/del", p.id);
      globalThis.location.replace(`/pri/domain/invite/${p.domain_id}`);
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="del">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text
        name="name"
        label="Name"
        value={p.name}
        disabled={true}
        readonly={true}
      />
      <Text
        name="name"
        label="Jitsi Domain Name"
        value={p.domain_name}
        disabled={true}
        readonly={true}
      />
      <Text
        name="url"
        label="Jitsi Domain URL"
        value={p.domain_url}
        disabled={true}
        readonly={true}
      />

      {#if warning}
        <Warning>The delete request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel bind:disabled on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Delete" bind:disabled />
      </div>
    </form>
  </div>
</section>
