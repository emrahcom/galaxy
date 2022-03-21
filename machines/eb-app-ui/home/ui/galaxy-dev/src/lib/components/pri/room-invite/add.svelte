<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import type { Room } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let room: Room;

  const date = new Date();

  let warning = false;
  let p = {
    name: `invite-${date.getTime() % 10000000000}`,
    room_id: room.id,
  };

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/room/invite/${room.id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await action("/api/pri/room/invite/add", p);
      window.location.href = `/pri/room/invite/${room.id}`;
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
      <Text name="room_name" label="Room" value={room.name} readonly={true} />
      <Text
        name="domain_name"
        label="Jitsi Domain Name"
        value={room.domain_name}
        readonly={true}
      />
      <Text
        name="domain_url"
        label="Jitsi Domain URL"
        value={room.domain_url}
        readonly={true}
      />

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
