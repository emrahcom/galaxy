<script lang="ts">
  import { onMount } from "svelte";
  import { Toast } from "bootstrap";
  import { actionById } from "$lib/api";
  import { delMessage, watchMessage } from "$lib/pri/intercom";
  import type { IntercomMessage222 } from "$lib/types";

  interface Props {
    msg: IntercomMessage222;
  }

  const { msg }: Props = $props();

  const href = `/pri/phone/join/${msg.id}`;
  let toast: HTMLElement;
  let ring: HTMLAudioElement;

  watchMessage(msg.id);

  // ---------------------------------------------------------------------------
  onMount(() => {
    try {
      toast = document.getElementById(`msg-${msg.id}`) as HTMLElement;
      if (toast) Toast.getOrCreateInstance(toast).show();

      ring = document.getElementById(`ring-${msg.id}`) as HTMLAudioElement;
      if (ring) ring.play();
    } catch {
      // Do nothing
    }
  });

  // ---------------------------------------------------------------------------
  // The message will be removed from the storage in the join page.
  // ---------------------------------------------------------------------------
  function accept() {
    try {
      // Stop ringing without waiting for the status update.
      if (ring) ring.pause();

      // Close toast.
      if (toast) Toast.getOrCreateInstance(toast).hide();
    } catch {
      // Do nothing.
      // localStorage will be deleted in join page.
    }
  }

  // ---------------------------------------------------------------------------
  async function reject() {
    try {
      // Stop ringing without waiting for the status update.
      if (ring) ring.pause();

      // Close toast.
      if (toast) Toast.getOrCreateInstance(toast).hide();

      // Set message status to rejected.
      await actionById("/api/pri/intercom/set/rejected", msg.id);
    } finally {
      // Remove the message from the storage and inform other tabs.
      delMessage(msg.id);
    }
  }

  // ---------------------------------------------------------------------------
  async function close() {
    try {
      // Stop ringing without waiting for the status update.
      if (ring) ring.pause();

      // Set message status to seen.
      await actionById("/api/pri/intercom/set/seen", msg.id);
    } finally {
      // Remove the message from the storage and inform other tabs.
      delMessage(msg.id);
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
      <span class="fs-6 fw-bold me-2 mt-auto mb-1">
        {msg.intercom_attr.phone_name || "unknown"}
      </span>
      <span class="fs-6 me-auto mt-auto mb-1">is ringing...</span>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="toast"
        aria-label="Close"
        onclick={close}
      ></button>
    </div>
    <div class="d-flex justify-content-center">
      <button
        class="btn btn-sm m-2 mb-0 btn-danger"
        type="button"
        onclick={reject}
      >
        Reject
      </button>
      <a class="btn btn-sm m-2 mb-0 btn-success" {href} onclick={accept}>
        Accept
      </a>
      <audio id="ring-{msg.id}" src="/ringing.mp3" loop></audio>
    </div>
  </div>
</div>
