<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import type { IdentityKey } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: IdentityKey;
  }

  const { p }: Props = $props();

  const domainDisplayName = $derived.by(() => {
    if (!p.domain_enabled) {
      return `${p.domain_name} - DISABLED`;
    }

    return p.domain_name;
  });

  let warning = $state(false);
  let disabled = $state(false);

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = "/pri/identity/key";
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      warning = false;
      disabled = true;

      await actionById("/api/pri/identity/key/disable", p.id);
      globalThis.location.replace("/pri/identity/key");
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="disable">
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
        name="domain_name"
        label="Jitsi Domain Name"
        value={domainDisplayName}
        disabled={true}
        readonly={true}
      />
      <Text
        name="domain_url"
        label="Jitsi Domain URL"
        value={p.domain_url}
        disabled={true}
        readonly={true}
      />

      {#if warning}
        <Warning>The disable request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel {disabled} onclick={cancel} />
        <SubmitBlocker />
        <Submit {disabled} label="Disable" />
      </div>
    </form>
  </div>
</section>
