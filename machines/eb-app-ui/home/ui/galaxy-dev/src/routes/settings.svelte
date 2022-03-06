<script lang="ts">
  import { KRATOS } from "$lib/config";
  import { page } from "$app/stores";
  import { getFlowId, getDataModels } from "$lib/kratos";
  import Form from "$lib/components/kratos/form.svelte";
  import Layout from "$lib/components/kratos/layout.svelte";
  import Messages from "$lib/components/kratos/messages.svelte";

  const flowId = getFlowId($page.url.search);
  if (!flowId) window.location.href = `${KRATOS}/self-service/settings/browser`;

  let promise = getDataModels("settings", flowId);
</script>

<!-- -------------------------------------------------------------------------->
<section id="settings">
  {#await promise then dm}
    {#if dm.instanceOf === "KratosForm"}
      <Layout>
        <p class="h3 text-muted">Update my account settings</p>

        {#if dm.ui.messages}
          <Messages messages={dm.ui.messages} />
        {:else}
          <div class="my-5" />
          <Form {dm} groups={["default", "profile"]} />
          <div class="my-5" />
          <Form {dm} groups={["default", "password"]} />
        {/if}
      </Layout>
    {:else}
      <p class="text-center">Something went wrong</p>
    {/if}
  {/await}
</section>
