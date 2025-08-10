<script lang="ts">
  import { page } from "$app/stores";
  import { actionById } from "$lib/api";
  import { delMessage } from "$lib/pri/intercom";
  import type { IntercomMessage222 } from "$lib/types";
  import Spinner from "$lib/components/common/spinner.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  // ---------------------------------------------------------------------------
  async function join(msgId: string) {
    const json = globalThis.localStorage.getItem(`msg-${msgId}`);
    if (!json) throw "storage item is not found";

    const msg = JSON.parse(json) as IntercomMessage222;
    const url = msg.intercom_attr.url;

    await actionById("/api/pri/intercom/set/accepted", msgId);
    delMessage(msgId);

    globalThis.location.replace(url);
  }

  const pr = join($page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Join the call" />

{#await pr}
  <Spinner>joining...</Spinner>
{:then}
  <Spinner>joining...</Spinner>
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
