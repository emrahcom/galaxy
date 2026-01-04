<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import type { Contact } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Email from "$lib/components/common/form-email.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Textarea from "$lib/components/common/form-textarea.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: Contact;
  }

  const { p }: Props = $props();

  let warning = $state(false);
  let disabled = $state(false);
  let message = $state("");

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = "/pri/contact";
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      const payload = {
        contact_id: p.id,
        message: message,
      };

      warning = false;
      disabled = true;

      await action("/api/pri/contact/text", payload);
      globalThis.location.replace("/pri/contact");
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="text">
  <div class="d-flex mt-2 justify-content-center">
    <form {onsubmit} style="width:{FORM_WIDTH};">
      <Text
        name="name"
        label="Contact"
        value={p.name}
        disabled={true}
        readonly={true}
      />
      <Text
        name="profile_name"
        label="Name"
        value={p.profile_name || ""}
        disabled={true}
        readonly={true}
      />
      <Email
        name="profile_email"
        label="Email"
        value={p.profile_email || ""}
        disabled={true}
        readonly={true}
      />
      <Textarea
        name="message"
        label="Message"
        bind:value={message}
        required={true}
      />

      {#if warning}
        <Warning>An error occurred during the sending.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel {disabled} onclick={cancel} />
        <SubmitBlocker />
        <Submit {disabled} label="Send" />
      </div>
    </form>
  </div>
</section>
