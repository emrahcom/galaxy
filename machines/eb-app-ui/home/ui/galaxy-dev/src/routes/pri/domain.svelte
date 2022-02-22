<script lang="ts">
  import { listDomain } from "$lib/pri/domain";

  const promise = listDomain();
</script>

<!-- -------------------------------------------------------------------------->
{#await promise}
  <p class="text-center">Waiting...</p>
{:then domains}
  {domains}
{:catch}
  <p class="text-center">Something went wrong</p>
{/await}
