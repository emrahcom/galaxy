<script lang="ts">
  import { KRATOS } from "$lib/config";
  import { page } from "$app/stores";
  import { getFlowId, getDataModels } from "$lib/kratos";
  import Form from "$lib/components/kratos/form.svelte";
  import Layout from "$lib/components/kratos/layout.svelte";
  import Messages from "$lib/components/kratos/messages.svelte";

  const flowId = getFlowId($page.url.search);
  if (!flowId)
    window.location.href = `${KRATOS}/self-service/registration/browser`;

  const pr = getDataModels("registration", flowId);
</script>

<!-- -------------------------------------------------------------------------->
<section id="registration">
  {#await pr then dm}
    {#if dm.instanceOf === "KratosForm"}
      <Layout>
        <p class="h3 text-muted">Create your account</p>

        {#if dm.ui.messages}
          <Messages messages={dm.ui.messages} />
        {/if}
        <Form {dm} groups={["default", "password"]} />

        <hr class="divider" />

        <section class="alternative-actions">
          <p><a href="/id/login">Already have an account?</a></p>
        </section>
      </Layout>
    {:else}
      <p class="text-center">...</p>
    {/if}
  {/await}
</section>
