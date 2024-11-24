<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, actionByCode } from "$lib/api";
  import type { IntercomCall, IntercomRing, Phone111 } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Email from "$lib/components/common/form-email.svelte";
  import Spinner from "$lib/components/common/spinner.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: Phone111;
  }

  let { p }: Props = $props();

  let warning = $state(false);
  let disabled = $state(false);
  let inCall = $state(false);
  let call: IntercomCall;
  let ring: IntercomRing;
  let ringCounter = 0;

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = "/";
  }

  // ---------------------------------------------------------------------------
  function endCall() {
    inCall = false;
    disabled = false;
  }

  // ---------------------------------------------------------------------------
  async function ringCall() {
    ringCounter += 1;

    try {
      const payload = {
        code: p.code,
        intercom_id: call.id,
      };

      // stop ringing if it is stopped from UI or if already a lot of attempts
      if (!inCall || ringCounter > 10) {
        // use both code and id
        //await actionById("/api/pub/intercom/del", call.id);

        inCall = false;
        disabled = false;
        return;
      }

      // refresh the call and check if there is a response from the peer
      // use both code and id
      ring = await action("/api/pub/intercom/phone/ring", payload);

      // ring again after a while if still no response from the peer
      if (ring.status === "none" || ring.status === "seen") {
        setTimeout(ringCall, 2000);
        return;
      }

      // since there are only two options (rejected or accepted) at this stage,
      // end the call
      // await actionById("/api/pri/intercom/del", call.id);

      inCall = false;
      disabled = false;

      // go to the meeting room if accepted
      // get publicUrl
      //if (ring.status === "accepted") globalThis.location.href = call.Url;
    } catch {
      // cancel the call if error
      inCall = false;
      warning = true;
      disabled = false;
    }
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      inCall = true;
      warning = false;
      disabled = true;
      ringCounter = 0;

      // initialize the call and get the call data
      // this will also send a notification to the owner about the call
      call = await actionByCode("/api/pub/phone/call/bycode", p.code);

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
  <div class="d-flex mt-2 justify-content-center">
    <form {onsubmit} style="width:{FORM_WIDTH};">
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

      {#if inCall}
        <Spinner effect="grow">ringing...</Spinner>
      {/if}

      {#if warning}
        <Warning>An error occurred during the call.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        {#if inCall}
          <Cancel onclick={endCall} />
        {:else}
          <Cancel {disabled} onclick={cancel} />
          <SubmitBlocker />
          <Submit {disabled} label="Call" />
        {/if}
      </div>
    </form>
  </div>
</section>
