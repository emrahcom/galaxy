<script lang="ts">
  import { KRATOS } from "$lib/config";
  import { page } from "$app/stores";
  import { getFlowId, getDataModels } from "$lib/kratos";
  import Form from "$lib/components/kratos/form.svelte";
  import Layout from "$lib/components/kratos/layout.svelte";
  import Messages from "$lib/components/kratos/messages.svelte";

  const flowId = getFlowId($page.url.search);
  if (!flowId) window.location.href = `${KRATOS}/self-service/recovery/browser`;

  const promise = getDataModels("recovery", flowId);
</script>

<!-- -------------------------------------------------------------------------->
<section id="recovery">
  {#await promise then dm}
    {#if dm.instanceOf === "KratosForm"}
      <Layout>
        <p class="h3 text-muted">Forgot password?</p>
        <p class="small text-muted my-4 text-start">
          Enter the email address associated with your account and we will send
          you a link to reset your password.
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
  {/await}
</section>
