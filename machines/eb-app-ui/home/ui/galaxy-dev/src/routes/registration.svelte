<script lang="ts" context="module">
  import { getKratosLoad } from "$lib/kratos";
  import type { KratosLoad } from "$lib/kratos-types";

  export async function load(): Promise<KratosLoad> {
    return await getKratosLoad("registration");
  }
</script>

<!-- -------------------------------------------------------------------------->
<script lang="ts">
  import { APP } from "$lib/config";
  import type { KratosForm, KratosError } from "$lib/kratos-types";
  import Form from "$lib/components/form.svelte";

  export let dm: KratosForm | KratosError;

  if (dm.instanceOf === "KratosError") console.error(dm);
</script>

<!-- -------------------------------------------------------------------------->
{#if dm.instanceOf === "KratosForm"}
  <div class="container" id="registration">
    <h2 class="subheading">Registration</h2>

    <Form {dm} groups={["default", "password"]} />

    <hr class="divider" />

    <div class="alternative-actions">
      <a href="{APP}/login">Already have an account? Log in instead</a>
    </div>
  </div>
{:else}
  <p>Something went wrong</p>
{/if}
