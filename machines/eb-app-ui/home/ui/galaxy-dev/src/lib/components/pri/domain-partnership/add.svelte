<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import type { DomainInvite111 } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let invite: DomainInvite111;
  export let isExist: boolean;

  let warning = false;
  let p = {
    code: invite.code,
  };

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/domain`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await action("/api/pri/domain/partnership/add/bycode", p);
      window.location.href = `/pri/domain`;
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text
        name="name"
        label="Jitsi Domain Name"
        value={invite.domain_name}
        disabled={true}
        readonly={true}
      />
      <Text
        name="url"
        label="Jitsi Domain URL"
        value={invite.domain_url}
        disabled={true}
        readonly={true}
      />

      {#if warning}
        <Warning>The add request is not accepted.</Warning>
      {/if}

      {#if isExist}
        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel on:click={cancel} />
          <SubmitBlocker />
          <Submit label="Add" />
        </div>
      {:else}
        <Warning>This domain is already in your list. Nothing to do.</Warning>

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel label="Skip" on:click={cancel} />
        </div>
      {/if}
    </form>
  </div>
</section>
