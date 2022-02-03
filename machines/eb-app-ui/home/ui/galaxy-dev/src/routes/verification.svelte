<script lang="ts" context="module">
  import { getKratosLoad } from "$lib/kratos";
  import type { KratosLoad } from "$lib/kratos-types";

  export async function load(): Promise<KratosLoad> {
    return await getKratosLoad("verification");
  }
</script>

<!-- -------------------------------------------------------------------------->
<script lang="ts">
  import type { KratosForm, KratosError } from "$lib/kratos-types";
  import Form from "$lib/components/form.svelte";

  export let dm: KratosForm | KratosError;

  if (dm.instanceOf === "KratosError") console.error(dm);
</script>

<!-- -------------------------------------------------------------------------->
{#if dm.instanceOf === "KratosForm"}
  <div class="container" id="verification">
    <h2 class="subheading">verification</h2>

    <Form {dm} groups={["default", "link"]} />
  </div>
{:else}
  <p>Something went wrong</p>
{/if}
