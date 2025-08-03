<script lang="ts">
  import { onMount } from "svelte";
  import { Toast } from "bootstrap";
  import { actionById } from "$lib/api";
  import type { IntercomMessage222 } from "$lib/types";

  interface Props {
    msg: IntercomMessage222;
  }

  let { msg }: Props = $props();

  let toast: HTMLElement;
  let sound: HTMLAudioElement;

  // ---------------------------------------------------------------------------
  onMount(() => {
    try {
      toast = document.getElementById(`msg-${msg.id}`) as HTMLElement;
      if (toast) Toast.getOrCreateInstance(toast).show();

      sound = document.getElementById(`sound-${msg.id}`) as HTMLAudioElement;
      if (sound) sound.play();
    } catch {
      // do nothing
    }
  });

  // ---------------------------------------------------------------------------
  async function close() {
    try {
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
      <i class="bi bi-chat-left-dots text-primary fs-5 me-3"></i>
      <span class="fs-6 fw-bold me-2 mt-auto mb-1">
        {msg.contact_name || "unknown"}
      </span>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="toast"
        aria-label="Close"
        onclick={close}
      ></button>
    </div>
    <div class="d-flex justify-content-center">
      Hello
      <audio id="sound-{msg.id}" src="/notification.mp3"></audio>
    </div>
  </div>
</div>
