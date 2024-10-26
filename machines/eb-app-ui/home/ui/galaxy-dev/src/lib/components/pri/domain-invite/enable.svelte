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
  async function onsubmit() {
    try {
      warning = false;
      disabled = true;

      await actionById("/api/pri/domain/invite/enable", p.id);
      globalThis.location.href = `/pri/domain/invite/${p.domain_id}`;
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="enable">
  <div class="d-flex mt-2 justify-content-center">
    <form {onsubmit} style="width:{FORM_WIDTH};">
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
        <Warning>The enable request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel {disabled} onclick={cancel} />
        <SubmitBlocker />
        <Submit {disabled} label="Enable" />
      </div>
    </form>
  </div>
</section>
