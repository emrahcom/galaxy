<script lang="ts">
  import { onMount } from "svelte";
  import { Toast } from "bootstrap";
  import { actionById } from "$lib/api";
  import { delMessage, watchTextMessage } from "$lib/pri/intercom";
  import type { IntercomMessage222 } from "$lib/types";

  interface Props {
    msg: IntercomMessage222;
  }

  let { msg }: Props = $props();

  let toast: HTMLElement;
  let sound: HTMLAudioElement;

  watchTextMessage(msg.id);

  // ---------------------------------------------------------------------------
  onMount(() => {
    try {
      toast = document.getElementById(`msg-${msg.id}`) as HTMLElement;
      if (toast) Toast.getOrCreateInstance(toast).show();

      sound = document.getElementById(`sound-${msg.id}`) as HTMLAudioElement;
      if (sound) sound.play();
    } catch {
      // Do nothing
    }
  });

  // ---------------------------------------------------------------------------
  async function close() {
    try {
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
      <i class="bi bi-chat-left-dots text-primary fs-5 me-3"></i>
      <span class="fs-6 fw-bold me-2 mt-auto mb-1">
        {msg.contact_name || "unknown"}
      </span>
      <span class="fs-6 me-auto mt-auto mb-1"></span>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="toast"
        aria-label="Close"
        onclick={close}
      ></button>
    </div>
    <div class="d-flex justify-content-left overflow-auto">
      <p
        class="d-inline-block card-text text-muted text-start w-auto mt-3"
        style="max-height: 200px; max-width: 90%; white-space: pre"
      >
        {msg.intercom_attr.message || ""}
      </p>

      <audio id="sound-{msg.id}" src="/notification.mp3"></audio>
    </div>
  </div>
</div>
