<script lang="ts">
  import { onMount } from "svelte";
  import { Toast } from "bootstrap";
  import { actionById } from "$lib/api";
  import { watchCall } from "$lib/pri/intercom";
  import type { IntercomMessage } from "$lib/types";

  export let msg: IntercomMessage;

  const href = `/pri/call/join/${msg.id}`;
  let toast: HTMLElement;
  let ring: HTMLAudioElement;

  watchCall(msg.id);

  // ---------------------------------------------------------------------------
  onMount(() => {
    try {
      toast = document.getElementById(`msg-${msg.id}`) as HTMLElement;
      if (toast) Toast.getOrCreateInstance(toast).show();

      ring = document.getElementById(`ring-${msg.id}`) as HTMLAudioElement;
      if (ring) ring.play();
    } catch {
      // do nothing
    }
  });

  // ---------------------------------------------------------------------------
  function accept(e: MouseEvent) {
    try {
      console.error(e);
      // stop ringing without waiting for the status update
      if (ring) ring.pause();

      // close toast
      if (toast) Toast.getOrCreateInstance(toast).hide();
    } catch {
      // do nothing
      // localStorage will be deleted in join page
    }
  }

  // ---------------------------------------------------------------------------
  async function reject() {
    try {
      // stop ringing without waiting for the status update
      if (ring) ring.pause();

      // close toast
      if (toast) Toast.getOrCreateInstance(toast).hide();

      // set message status to rejected
      await actionById("/api/pri/intercom/set/rejected", msg.id);
    } finally {
      // remove the message from the storage to inform other tabs
      globalThis.localStorage.removeItem(`msg-${msg.id}`);
    }
  }

  // ---------------------------------------------------------------------------
  async function close() {
    try {
      // stop ringing without waiting for the status update
      if (ring) ring.pause();

      // set message status to seen
      await actionById("/api/pri/intercom/set/seen", msg.id);
    } finally {
      // remove the message from the storage to inform other tabs
      globalThis.localStorage.removeItem(`msg-${msg.id}`);
    }
  }
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
      <button
        class="btn btn-sm m-2 mb-0 btn-danger"
        type="button"
        on:click={reject}
      >
        Reject
      </button>
      <a
        class="btn btn-sm m-2 mb-0 btn-success"
        {href}
        on:click={(e) => {
          accept(e);
        }}
      >
        Accept
      </a>
      <audio id="ring-{msg.id}" src="/ringing.mp3" loop></audio>
    </div>
  </div>
</div>
