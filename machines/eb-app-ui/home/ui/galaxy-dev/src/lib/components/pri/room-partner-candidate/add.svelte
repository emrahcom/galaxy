<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, listById } from "$lib/api";
  import type { Contact, Room } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    room: Room;
  }

  let { room }: Props = $props();

  const pr = listById("/api/pri/contact/list/byroom", room.id, 1000).then(
    (items: Contact[]) => {
      return items.map((i) => [
        i.id,
        `${i.name}${i.profile_email ? ` (${i.profile_email})` : ""}`,
      ]);
    },
  );

  let warning = $state(false);
  let disabled = $state(false);
  let p = $state({
    contact_id: "",
    room_id: room.id,
  });

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = `/pri/room/partner/${room.id}`;
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      warning = false;
      disabled = true;

      await action("/api/pri/room/partner/candidate/add", p);
      globalThis.location.href = `/pri/room/partner/${room.id}`;
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  {#await pr then contacts}
    <div class="d-flex mt-2 justify-content-center">
      <form {onsubmit} style="width:{FORM_WIDTH};">
        <Select
          id="contact_id"
          label="Contact"
          bind:value={p.contact_id}
          options={contacts}
        />
        <Text
          name="room_name"
          label="Room"
          value={room.name}
          disabled={true}
          readonly={true}
        />
        <Text
          name="domain_name"
          label="Jitsi Domain Name"
          value={room.domain_name}
          disabled={true}
          readonly={true}
        />
        <Text
          name="domain_url"
          label="Jitsi Domain URL"
          value={room.domain_url}
          disabled={true}
          readonly={true}
        />

        {#if warning}
          <Warning>
            The invite request is not accepted. Please check your inputs.
          </Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel {disabled} onclick={cancel} />
          <SubmitBlocker />
          <Submit {disabled} label="Invite" />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
