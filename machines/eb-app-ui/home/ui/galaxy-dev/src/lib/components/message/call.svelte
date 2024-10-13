<script lang="ts">
  import { onMount } from "svelte";
  import { Toast } from "bootstrap";
  import { actionById } from "$lib/api";
  import { watchCall } from "$lib/pri/intercom";
  import type { IntercomMessage } from "$lib/types";

  export let msg: IntercomMessage;

  watchCall(msg.id);

  // ---------------------------------------------------------------------------
  function close() {
    try {
      // set message status to seen
      actionById("/api/pri/intercom/set/seen", msg.id);
    } catch {
      // do nothing
    }
  }

  // ---------------------------------------------------------------------------
  onMount(() => {
    try {
      const toast = document.getElementById(`msg-${msg.id}`);
      if (toast) Toast.getOrCreateInstance(toast).show();

      const ring = document.getElementById(
        `ring-${msg.id}`,
      ) as HTMLAudioElement;
      if (ring) ring.play();
    } catch {
      // do nothing
    }
  });
</script>

<!-- -------------------------------------------------------------------------->
<div
  id="msg-{msg.id}"
  class="toast"
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
  data-bs-autohide="false"
>
  <div class="toast-body">
    <div class="d-flex">
      <i class="bi bi-telephone text-primary fs-5 me-3"></i>
      <span class="fs-6 fw-bold me-2 mt-auto mb-1">{msg.contact_name}</span>
      <span class="fs-6 me-auto mt-auto mb-1">is calling...</span>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="toast"
        aria-label="Close"
        on:click={close}
      ></button>
    </div>
    <div class="d-flex justify-content-center">
      <button class="btn btn-sm m-2 mb-0 btn-danger" type="button"
        >Reject</button
      >
      <button class="btn btn-sm m-2 mb-0 btn-success" type="button"
        >Accept</button
      >
      <audio id="ring-{msg.id}" src="/ringing.mp3" loop></audio>
    </div>
  </div>
</div>
