<script lang="ts">
  import { KRATOS } from "$lib/config";
  import { page } from "$app/stores";
  import { get } from "svelte/store";
  import { getFlowId, getDataModels } from "$lib/kratos";
  import identity from "$lib/stores/kratos/identity";
  import Form from "$lib/components/kratos/form.svelte";
  import Layout from "$lib/components/kratos/layout.svelte";
  import Messages from "$lib/components/kratos/messages.svelte";

  const _identity = get(identity);
  if (!_identity) window.location.href = `${KRATOS}/self-service/login/browser`;

  const flowId = getFlowId($page.url.search);
  if (!flowId)
    window.location.href = `${KRATOS}/self-service/verification/browser`;

  const pr = getDataModels("verification", flowId);
</script>

<!-- -------------------------------------------------------------------------->
<section id="verification">
  {#await pr then dm}
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
      <p class="text-center">...</p>
    {/if}
  {/await}
</section>
