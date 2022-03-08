<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import type { Room } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import Switch from "$lib/components/common/form-switch.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: Room;

  let warning = false;

  function cancel() {
    window.location.href = "/pri/room";
  }

  async function onSubmit() {
    try {
      warning = false;
      await actionById("/api/pri/room/del", p.id);
      window.location.href = "/pri/room";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="del">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" value={p.name} readonly={true} />
      <Text
        name="domain"
        label="Jitsi Domain"
        value={p.domain_name}
        readonly={true}
      />
      <Switch
        name="has_suffix"
        label="Enable unpredictable room name generator"
        value={p.has_suffix}
        disabled={true}
      />

      {#if warning}
        <Warning>The delete request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <Submit label="Delete" />
      </div>
    </form>
  </div>
</section>
