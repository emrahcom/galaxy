<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, list } from "$lib/api";
  import type { Domain333, Phone, Profile } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Switch from "$lib/components/common/form-switch.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: Phone;
  }

  const { p }: Props = $props();

  let warning = $state(false);
  let disabled = $state(false);

  const pr1 = list("/api/pri/profile/list", 100).then((items: Profile[]) => {
    return items.map((i) => {
      let desc: string;

      if (i.email) {
        desc = `${i.name} (${i.email})`;
      } else {
        desc = i.name;
      }

      return [i.id, desc];
    });
  });

  const pr2 = list("/api/pri/domain/list", 100).then((items: Domain333[]) => {
    return items.map((i) => [
      i.id,
      `${i.name}${i.enabled ? "" : " - DISABLED"}`,
    ]);
  });

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = "/pri/phone";
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      warning = false;
      disabled = true;

      await action("/api/pri/phone/update", p);
      globalThis.location.href = "/pri/phone";
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="update">
  {#await Promise.all([pr1, pr2]) then [profiles, domains]}
    <div class="d-flex mt-2 justify-content-center">
      <form {onsubmit} style="width:{FORM_WIDTH};">
        <Text name="name" label="Name" bind:value={p.name} required={true} />
        <Select
          id="domain_id"
          label="Jitsi Domain"
          bind:value={p.domain_id}
          options={domains}
        />

        <Select
          id="profile_id"
          label="Profile"
          bind:value={p.profile_id}
          options={profiles}
        />

        <Switch
          name="email_enabled"
          label="Send me email notifications for calls"
          bind:value={p.email_enabled}
        />

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
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
