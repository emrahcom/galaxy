<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, actionById, list } from "$lib/api";
  import type {
    Contact,
    Domain333,
    IntercomCall,
    IntercomRing,
  } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Email from "$lib/components/common/form-email.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Spinner from "$lib/components/common/spinner.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: Contact;

  let warning = false;
  let disabled = false;
  let inCall = false;
  let call: IntercomCall;
  let ring: IntercomRing;
  let ringCounter = 0;
  let domainId = "";

  const pr = list("/api/pri/domain/list", 100).then((items: Domain333[]) => {
    const enableds = items
      .filter((i) => i.enabled)
      .sort((i, j) => (i.updated_at > j.updated_at ? -1 : 1));
    if (enableds[0]) domainId = enableds[0].id;

    return items.filter((i) => i.enabled).map((i) => [i.id, i.name]);
  });

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = "/pri/contact";
  }

  // ---------------------------------------------------------------------------
  async function ringCall() {
    ringCounter += 1;

    try {
      // stop ringing if it is stopped from UI or if already a lot of attempts
      if (!inCall || ringCounter > 10) {
        inCall = false;
        disabled = false;

        // remove the call
        await actionById("/api/pri/intercom/call/del", call.id);

        return;
      }

      // refresh the call and check if there is a response from the peer
      ring = await actionById("/api/pri/intercom/call/ring", call.id);

      if (!ring) {
        throw new Error("ring failed");
      } else if (ring.status === "rejected") {
        inCall = false;
        disabled = false;

        // remove the call
        await actionById("/api/pri/intercom/call/del", call.id);
      } else if (ring.status === "accepted") {
        // go to the meeting room
        window.location.href = call.url;
      } else {
        // ring again after a while since still no response from the peer
        setTimeout(ringCall, 2000);
      }
    } catch {
      // cancel the call if error
      inCall = false;
      warning = true;
      disabled = false;
    }
  }

  // ---------------------------------------------------------------------------
  function endCall() {
    inCall = false;
    disabled = false;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      const data = {
        contact_id: p.id,
        domain_id: domainId,
      };

      inCall = true;
      warning = false;
      disabled = true;
      ringCounter = 0;

      // initialize the call and get the call data
      call = await action("/api/pri/contact/call", data);
      if (!call.url) throw new Error("no url for call");

      // start ringing
      setTimeout(ringCall, 1000);
    } catch {
      inCall = false;
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="call">
  {#await pr then domains}
    <div class="d-flex mt-2 justify-content-center">
      <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
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
        <Select
          id="domain_id"
          label="Jitsi Domain"
          bind:value={domainId}
          options={domains}
        />

        {#if inCall}
          <Spinner effect="grow">ringing...</Spinner>
        {/if}

        {#if warning}
          <Warning>An error occurred during the call.</Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          {#if inCall}
            <Cancel on:click={endCall} />
          {:else}
            <Cancel bind:disabled on:click={cancel} />
            <SubmitBlocker />
            <Submit label="Call" bind:disabled />
          {/if}
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
