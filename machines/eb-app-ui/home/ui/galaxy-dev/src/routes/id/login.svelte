<script lang="ts">
  import { KRATOS } from "$lib/config";
  import { page } from "$app/stores";
  import { getFlowId, getDataModels } from "$lib/kratos";
  import Form from "$lib/components/kratos/form.svelte";
  import Layout from "$lib/components/kratos/layout.svelte";
  import Messages from "$lib/components/kratos/messages.svelte";

  const flowId = getFlowId($page.url.search);
  if (!flowId) window.location.href = `${KRATOS}/self-service/login/browser`;

  const promise = getDataModels("login", flowId);
</script>

<!-- -------------------------------------------------------------------------->
<section id="login">
  {#await promise then dm}
    {#if dm.instanceOf === "KratosForm"}
      <Layout>
        <p class="h3 text-muted">Sign in to your account</p>

        <Messages messages={dm.ui.messages} />
        <Form {dm} groups={["default", "password"]} />

        <hr class="divider" />

        <section class="alternative-actions">
          <p><a href="/id/recovery">Forgot Password?</a></p>
          <p><a href="/id/registration">Don't have an account?</a></p>
        </section>
      </Layout>
    {:else}
      <p class="text-center">Something went wrong</p>
    {/if}
  {/await}
</section>
