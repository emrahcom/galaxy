<script lang="ts" context="module">
  import { KRATOS } from "$lib/config";
  import { get } from "svelte/store";
  import { getKratosLoad } from "$lib/kratos";
  import identity from "$lib/stores/kratos/identity";
  import type { KratosLoad } from "$lib/kratos/types";

  export async function load(): Promise<KratosLoad> {
    const _identity = get(identity);

    if (!_identity) {
      return {
        status: 302,
        redirect: `${KRATOS}/self-service/login/browser`,
      };
    }

    return await getKratosLoad("verification");
  }
</script>

<!-- -------------------------------------------------------------------------->
<script lang="ts">
  import type { KratosForm, KratosError } from "$lib/kratos/types";
  import Layout from "$lib/components/kratos/layout.svelte";
  import Form from "$lib/components/kratos/form.svelte";
  import Messages from "$lib/components/kratos/messages.svelte";

  export let dm: KratosForm | KratosError;
</script>

<!-- -------------------------------------------------------------------------->
<section id="verification">
  {#if dm.instanceOf === "KratosForm"}
    <Layout>
      <p class="h3 text-muted">Verify your email address</p>
      <p class="small text-muted my-4 text-start">
        Submit the email address associated with your account and we will send
        you a link to verify your email address.
      </p>

      {#if dm.ui.messages}
        <Messages messages={dm.ui.messages} />
      {:else}
        <Form {dm} groups={["default", "link"]} />
      {/if}
    </Layout>
  {:else}
    <p class="text-center">Something went wrong</p>
  {/if}
</section>
